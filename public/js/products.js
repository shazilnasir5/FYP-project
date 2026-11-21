
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("sellerToken");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    let products = [];

    // Page elements
    const sellerName = document.getElementById("sellerName");
    const sellerAvatar = document.getElementById("sellerAvatar");

    const productCount = document.getElementById("productCount");
    const inStockCount = document.getElementById("inStockCount");
    const outOfStockCount = document.getElementById("outOfStockCount");

    const productsTableBody = document.getElementById("productsTableBody");
    const productsMessage = document.getElementById("productsMessage");

    const addProductButton = document.getElementById("addProductButton");
    const productModal = document.getElementById("productModal");
    const closeModalButton = document.getElementById("closeModalButton");
    const cancelProductButton = document.getElementById("cancelProductButton");

    const productForm = document.getElementById("productForm");
    const productId = document.getElementById("productId");
    const productName = document.getElementById("productName");
    const productDescription = document.getElementById("productDescription");
    const productPrice = document.getElementById("productPrice");
    const productStock = document.getElementById("productStock");
    const productCategory = document.getElementById("productCategory");
    const productImage = document.getElementById("productImage");

    const productFormMessage = document.getElementById("productFormMessage");
    const modalTitle = document.getElementById("modalTitle");
    const saveProductButton = document.getElementById("saveProductButton");
    const logoutButton = document.getElementById("logoutButton");

    // Seller information
    try {
        const seller = JSON.parse(localStorage.getItem("sellerData") || "{}");

        if (sellerName) {
            sellerName.textContent = seller.name || "Seller";
        }

        if (sellerAvatar) {
            sellerAvatar.textContent = seller.name
                ? seller.name.charAt(0).toUpperCase()
                : "S";
        }
    } catch (error) {
        console.error("Unable to load seller information:", error);
    }

    // API helper
    async function apiRequest(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(options.headers || {})
            }
        });

        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem("sellerToken");
            localStorage.removeItem("sellerData");
            window.location.href = "login.html";
            throw new Error("Your session has expired. Please login again.");
        }

        if (!response.ok || data.success === false) {
            throw new Error(data.message || "Something went wrong.");
        }

        return data;
    }

    // Page message
    function showProductsMessage(message, type = "error") {
        if (!productsMessage) return;

        productsMessage.textContent = message;
        productsMessage.className = `products-message ${type}`;
        productsMessage.style.display = "block";
    }

    function hideProductsMessage() {
        if (!productsMessage) return;

        productsMessage.textContent = "";
        productsMessage.style.display = "none";
    }

    // Modal message
    function showFormMessage(message, type = "error") {
        if (!productFormMessage) return;

        productFormMessage.textContent = message;
        productFormMessage.className = `product-form-message ${type}`;
        productFormMessage.style.display = "block";
    }

    function hideFormMessage() {
        if (!productFormMessage) return;

        productFormMessage.textContent = "";
        productFormMessage.style.display = "none";
    }

    // Open modal
    function openModal(product = null) {
        productForm.reset();
        hideFormMessage();

        if (product) {
            modalTitle.textContent = "Edit Product";
            saveProductButton.textContent = "Update Product";

            productId.value = product.id;
            productName.value = product.name || "";
            productDescription.value = product.description || "";
            productPrice.value = product.price ?? "";
            productStock.value = product.stock ?? 0;
            productCategory.value = product.category || "General";
            productImage.value = product.image || "";
        } else {
            modalTitle.textContent = "Add New Product";
            saveProductButton.textContent = "Save Product";
            productId.value = "";
        }

        productModal.classList.add("active");
    }

    // Close modal
    function closeModal() {
        productModal.classList.remove("active");
        productForm.reset();
        hideFormMessage();
    }

    addProductButton.addEventListener("click", () => openModal());

    closeModalButton.addEventListener("click", closeModal);
    cancelProductButton.addEventListener("click", closeModal);

    // Safe image URL validation
    function getSafeImageUrl(value) {
        if (!value) return "";

        try {
            const url = new URL(value);

            if (url.protocol === "https:" || url.protocol === "http:") {
                return url.href;
            }
        } catch (error) {
            return "";
        }

        return "";
    }

    // Create table cell
    function createCell(value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        return cell;
    }

    // Update product counters
    function updateCounters() {
        const total = products.length;
        const inStock = products.filter(
            product => Number(product.stock) > 0
        ).length;

        const outOfStock = total - inStock;

        productCount.textContent = total;
        inStockCount.textContent = inStock;
        outOfStockCount.textContent = outOfStock;
    }

    // Render products table
    function renderProducts() {
        productsTableBody.replaceChildren();

        updateCounters();

        if (products.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 7;
            cell.textContent = "No products found. Add your first product!";
            cell.className = "empty-products-message";

            row.appendChild(cell);
            productsTableBody.appendChild(row);
            return;
        }

        products.forEach(product => {
            const row = document.createElement("tr");

            // Product image and name
            const productCell = document.createElement("td");
            const productInfo = document.createElement("div");
            productInfo.className = "product-info";

            const image = document.createElement("img");
            image.className = "product-thumbnail";
            image.alt = product.name || "Product";

            const safeImage = getSafeImageUrl(product.image);

            if (safeImage) {
                image.src = safeImage;
                image.onerror = () => {
                    image.style.display = "none";
                };
            } else {
                image.style.display = "none";
            }

            const name = document.createElement("span");
            name.textContent = product.name || "Unnamed Product";

            productInfo.append(image, name);
            productCell.appendChild(productInfo);
            row.appendChild(productCell);

            row.appendChild(createCell(product.category || "General"));

            const price = Number(product.price);
            row.appendChild(
                createCell(
                    Number.isFinite(price)
                        ? `Rs. ${price.toFixed(2)}`
                        : "Rs. 0.00"
                )
            );

            const stock = Number(product.stock) || 0;
            row.appendChild(createCell(String(stock)));

            // Stock status
            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            statusBadge.className = stock > 0
                ? "status-badge in-stock"
                : "status-badge out-of-stock";

            statusBadge.textContent = stock > 0
                ? "In Stock"
                : "Out of Stock";

            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);

            // Edit and delete buttons
            const actionsCell = document.createElement("td");
            const actions = document.createElement("div");
            actions.className = "product-actions";

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.className = "edit-product-button";
            editButton.addEventListener("click", () => {
                const selectedProduct = products.find(
                    item => String(item.id) === String(product.id)
                );

                if (selectedProduct) {
                    openModal(selectedProduct);
                }
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-product-button";

            deleteButton.addEventListener("click", () => {
                deleteProduct(product.id);
            });

            actions.append(editButton, deleteButton);
            actionsCell.appendChild(actions);
            row.appendChild(actionsCell);

            productsTableBody.appendChild(row);
        });
    }

    // Load products from backend
    async function loadProducts() {
        hideProductsMessage();

        try {
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="7">Loading products...</td>
                </tr>
            `;

            const data = await apiRequest("/api/products/");

            products = Array.isArray(data.products) ? data.products : [];

            renderProducts();
        } catch (error) {
            console.error("Load products error:", error);
            productsTableBody.replaceChildren();
            showProductsMessage(error.message || "Unable to load products.");
        }
    }

    // Add or update product
    productForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideFormMessage();

        const id = productId.value;

        const product = {
            name: productName.value.trim(),
            description: productDescription.value.trim(),
            price: Number(productPrice.value),
            stock: Number(productStock.value),
            category: productCategory.value.trim() || "General",
            image: productImage.value.trim()
        };

        if (!product.name) {
            showFormMessage("Please enter a product name.");
            return;
        }

        if (
            productPrice.value === "" ||
            !Number.isFinite(product.price) ||
            product.price < 0
        ) {
            showFormMessage("Please enter a valid product price.");
            return;
        }

        if (
            productStock.value === "" ||
            !Number.isInteger(product.stock) ||
            product.stock < 0
        ) {
            showFormMessage("Please enter a valid stock quantity.");
            return;
        }

        const isEditing = Boolean(id);

        const url = isEditing
            ? `/api/products/update/${encodeURIComponent(id)}`
            : "/api/products/add";

        const method = isEditing ? "PUT" : "POST";

        saveProductButton.disabled = true;
        saveProductButton.textContent = isEditing
            ? "Updating..."
            : "Saving...";

        try {
            const data = await apiRequest(url, {
                method,
                body: JSON.stringify(product)
            });

            closeModal();

            showProductsMessage(
                data.message || (
                    isEditing
                        ? "Product updated successfully!"
                        : "Product added successfully!"
                ),
                "success"
            );

            await loadProducts();
        } catch (error) {
            console.error("Save product error:", error);
            showFormMessage(error.message || "Unable to save product.");
        } finally {
            saveProductButton.disabled = false;
            saveProductButton.textContent = isEditing
                ? "Update Product"
                : "Save Product";
        }
    });

    // Delete product
    async function deleteProduct(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            const data = await apiRequest(
                `/api/products/delete/${encodeURIComponent(id)}`,
                { method: "DELETE" }
            );

            showProductsMessage(
                data.message || "Product deleted successfully!",
                "success"
            );

            await loadProducts();
        } catch (error) {
            console.error("Delete product error:", error);
            showProductsMessage(error.message || "Unable to delete product.");
        }
    }

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("sellerToken");
            localStorage.removeItem("sellerData");
            window.location.href = "login.html";
        });
    }

    // Initial page load
    loadProducts();
});
