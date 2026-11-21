const token = localStorage.getItem("sellerToken");

let sellerData = null;
let selectedTemplate = null;
let selectedContentElement = null;
let historyStack = [];
let historyIndex = -1;
let historyTimer = null;
let isRestoringHistory = false;
let draggedCanvasElement = null;

try {
    sellerData = JSON.parse(localStorage.getItem("sellerData") || "null");
} catch (error) {
    sellerData = null;
}

const websiteCanvas = document.getElementById("websiteCanvas");
const canvasEmptyState = document.getElementById("canvasEmptyState");
const websiteTitleInput = document.getElementById("websiteTitle");
const primaryColorInput = document.getElementById("primaryColor");
const secondaryColorInput = document.getElementById("secondaryColor");
const websiteFontInput = document.getElementById("websiteFont");
const saveWebsiteButton = document.getElementById("saveWebsiteButton");
const previewWebsiteButton = document.getElementById("previewWebsiteButton");
const startBuildingButton = document.getElementById("startBuildingButton");
const builderMessage = document.getElementById("builderMessage");
const sellerNameElement = document.getElementById("sellerName");
const userAvatarElement = document.getElementById("userAvatar");

const templateConfigs = {
    general: {
        name: "General Store",
        title: "Everything You Need",
        subtitle: "Discover quality products for everyday life.",
        button: "Shop Now",
        primary: "#2563eb",
        secondary: "#eff6ff",
        font: "Arial",
        className: "general-store"
    },
    fashion: {
        name: "Fashion Store",
        title: "Style That Defines You",
        subtitle: "Explore the latest fashion and timeless essentials.",
        button: "Explore Collection",
        primary: "#be185d",
        secondary: "#fce7f3",
        font: "Georgia",
        className: "fashion-store"
    },
    shoes: {
        name: "Shoe Store",
        title: "Step Into Something New",
        subtitle: "Find the perfect pair for every occasion.",
        button: "Shop Shoes",
        primary: "#1d4ed8",
        secondary: "#dbeafe",
        font: "Arial",
        className: "shoes-store"
    },
    bags: {
        name: "Bags Store",
        title: "Carry Your Style",
        subtitle: "Discover bags made for every journey.",
        button: "Explore Bags",
        primary: "#92400e",
        secondary: "#fef3c7",
        font: "Georgia",
        className: "bags-store"
    },
    jewelry: {
        name: "Jewelry Store",
        title: "Elegance in Every Detail",
        subtitle: "Beautiful pieces to make every moment special.",
        button: "Discover Jewelry",
        primary: "#a16207",
        secondary: "#fef9c3",
        font: "Georgia",
        className: "jewelry-store"
    },
    electronics: {
        name: "Electronics Store",
        title: "Technology Made Simple",
        subtitle: "Explore the latest gadgets and electronics.",
        button: "Shop Electronics",
        primary: "#0f766e",
        secondary: "#ccfbf1",
        font: "Arial",
        className: "electronics-store"
    },
    mobile: {
        name: "Mobile Store",
        title: "Upgrade Your World",
        subtitle: "Find smartphones and accessories you love.",
        button: "Explore Phones",
        primary: "#4338ca",
        secondary: "#e0e7ff",
        font: "Arial",
        className: "mobile-store"
    },
    beauty: {
        name: "Beauty Store",
        title: "Feel Beautiful Every Day",
        subtitle: "Discover beauty essentials for your routine.",
        button: "Shop Beauty",
        primary: "#db2777",
        secondary: "#fce7f3",
        font: "Georgia",
        className: "beauty-store"
    },
    skincare: {
        name: "Skincare Store",
        title: "Care For Your Skin",
        subtitle: "Simple skincare for healthy-looking skin.",
        button: "Explore Products",
        primary: "#0d9488",
        secondary: "#ccfbf1",
        font: "Arial",
        className: "skincare-store"
    },
    home: {
        name: "Home Store",
        title: "Make Yourself At Home",
        subtitle: "Thoughtful essentials for comfortable living.",
        button: "Shop Home",
        primary: "#15803d",
        secondary: "#dcfce7",
        font: "Georgia",
        className: "home-store"
    },
    decor: {
        name: "Home Decor",
        title: "Spaces With Personality",
        subtitle: "Bring warmth and character into your home.",
        button: "Explore Decor",
        primary: "#92400e",
        secondary: "#fef3c7",
        font: "Georgia",
        className: "decor-store"
    },
    grocery: {
        name: "Grocery Store",
        title: "Fresh Choices Every Day",
        subtitle: "Everyday essentials delivered with care.",
        button: "Shop Groceries",
        primary: "#16a34a",
        secondary: "#dcfce7",
        font: "Arial",
        className: "grocery-store"
    },
    food: {
        name: "Food Store",
        title: "Good Food, Great Moments",
        subtitle: "Discover delicious food and everyday favorites.",
        button: "Order Now",
        primary: "#ea580c",
        secondary: "#ffedd5",
        font: "Arial",
        className: "food-store"
    },
    sports: {
        name: "Sports Store",
        title: "Find Your Strength",
        subtitle: "Gear up for your next challenge.",
        button: "Shop Sports",
        primary: "#1d4ed8",
        secondary: "#dbeafe",
        font: "Arial",
        className: "sports-store"
    },
    books: {
        name: "Book Store",
        title: "A World Between Pages",
        subtitle: "Find your next favorite story.",
        button: "Explore Books",
        primary: "#7c2d12",
        secondary: "#ffedd5",
        font: "Georgia",
        className: "books-store"
    },
    kids: {
        name: "Kids Store",
        title: "Little Things, Big Smiles",
        subtitle: "Discover fun and thoughtful products for kids.",
        button: "Shop Kids",
        primary: "#7c3aed",
        secondary: "#ede9fe",
        font: "Arial",
        className: "kids-store"
    },
    pets: {
        name: "Pet Store",
        title: "Everything For Your Best Friend",
        subtitle: "Thoughtful essentials for happy pets.",
        button: "Shop Pet Products",
        primary: "#0f766e",
        secondary: "#ccfbf1",
        font: "Arial",
        className: "pets-store"
    },
    automotive: {
        name: "Automotive Store",
        title: "Drive With Confidence",
        subtitle: "Discover accessories and essentials for your vehicle.",
        button: "Explore Products",
        primary: "#334155",
        secondary: "#e2e8f0",
        font: "Arial",
        className: "automotive-store"
    },
    gifts: {
        name: "Gift Store",
        title: "Make Every Moment Special",
        subtitle: "Find thoughtful gifts for people you love.",
        button: "Explore Gifts",
        primary: "#be123c",
        secondary: "#ffe4e6",
        font: "Georgia",
        className: "gifts-store"
    },
    digital: {
        name: "Digital Store",
        title: "Ideas Made Digital",
        subtitle: "Explore useful digital products and resources.",
        button: "Explore Collection",
        primary: "#4f46e5",
        secondary: "#e0e7ff",
        font: "Arial",
        className: "digital-store"
    }
};

function getEditorState() {
    return {
        canvasHTML: websiteCanvas ? websiteCanvas.innerHTML : "",
        title: websiteTitleInput ? websiteTitleInput.value : "",
        primaryColor: primaryColorInput ? primaryColorInput.value : "",
        secondaryColor: secondaryColorInput ? secondaryColorInput.value : "",
        font: websiteFontInput ? websiteFontInput.value : "",
        selectedTemplate
    };
}

function saveHistoryState() {
    if (isRestoringHistory || !websiteCanvas) return;

    const state = getEditorState();
    const previousState = historyStack[historyIndex];

    if (previousState && JSON.stringify(previousState) === JSON.stringify(state)) {
        return;
    }

    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(state);

    if (historyStack.length > 50) {
        historyStack.shift();
    }

    historyIndex = historyStack.length - 1;
    updateHistoryButtons();
}

function scheduleHistoryState() {
    clearTimeout(historyTimer);
    historyTimer = setTimeout(saveHistoryState, 500);
}

function restoreHistoryState(state) {
    if (!state || !websiteCanvas) return;

    isRestoringHistory = true;
    websiteCanvas.innerHTML = state.canvasHTML;

    if (websiteTitleInput) websiteTitleInput.value = state.title;
    if (primaryColorInput) primaryColorInput.value = state.primaryColor;
    if (secondaryColorInput) secondaryColorInput.value = state.secondaryColor;
    if (websiteFontInput) websiteFontInput.value = state.font;

    selectedTemplate = state.selectedTemplate;
    selectedContentElement = null;

    bindCanvasElementEvents();
    updateWebsiteAppearance();
    updateHistoryButtons();

    isRestoringHistory = false;
}

function undoBuilderChange() {
    if (historyIndex <= 0) return;

    historyIndex--;
    restoreHistoryState(historyStack[historyIndex]);
}

function redoBuilderChange() {
    if (historyIndex >= historyStack.length - 1) return;

    historyIndex++;
    restoreHistoryState(historyStack[historyIndex]);
}

function updateHistoryButtons() {
    const undoButton = document.getElementById("builderUndoButton");
    const redoButton = document.getElementById("builderRedoButton");

    if (undoButton) undoButton.disabled = historyIndex <= 0;
    if (redoButton) redoButton.disabled = historyIndex >= historyStack.length - 1;
}

function enableElementDragging(element) {
    if (!element || element.dataset.dragEnabled === "true") return;

    element.dataset.dragEnabled = "true";
    element.draggable = true;

    element.addEventListener("dragstart", event => {
        if (event.target.closest("button,input,textarea,select,a")) {
            event.preventDefault();
            return;
        }

        draggedCanvasElement = element;
        element.classList.add("builder-element-dragging");

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", "builder-element");
    });

    element.addEventListener("dragend", () => {
        element.classList.remove("builder-element-dragging");

        document.querySelectorAll(".builder-drop-before, .builder-drop-after").forEach(item => {
            item.classList.remove("builder-drop-before", "builder-drop-after");
        });

        draggedCanvasElement = null;
    });
}

function installCanvasDragDropHandlers() {
    if (!websiteCanvas || websiteCanvas.dataset.dragDropBound === "true") return;

    websiteCanvas.dataset.dragDropBound = "true";

    websiteCanvas.addEventListener("dragover", event => {
        if (!draggedCanvasElement) return;

        event.preventDefault();

        const target = event.target.closest(".website-content-element");

        document.querySelectorAll(".builder-drop-before, .builder-drop-after").forEach(item => {
            item.classList.remove("builder-drop-before", "builder-drop-after");
        });

        if (!target || target === draggedCanvasElement) return;

        const rect = target.getBoundingClientRect();
        const placeAfter = event.clientY > rect.top + rect.height / 2;

        target.classList.add(placeAfter ? "builder-drop-after" : "builder-drop-before");
    });

    websiteCanvas.addEventListener("drop", event => {
        if (!draggedCanvasElement) return;

        event.preventDefault();

        const target = event.target.closest(".website-content-element");

        if (!target || target === draggedCanvasElement) return;

        const rect = target.getBoundingClientRect();
        const placeAfter = event.clientY > rect.top + rect.height / 2;

        if (placeAfter) {
            target.insertAdjacentElement("afterend", draggedCanvasElement);
        } else {
            target.insertAdjacentElement("beforebegin", draggedCanvasElement);
        }

        document.querySelectorAll(".builder-drop-before, .builder-drop-after").forEach(item => {
            item.classList.remove("builder-drop-before", "builder-drop-after");
        });

        saveHistoryState();
        showMessage("Element position updated.", "success");
    });
}

function bindCanvasElementEvents() {
    if (!websiteCanvas) return;

    websiteCanvas.querySelectorAll(".website-content-element").forEach(element => {
        enableElementDragging(element);

        if (element.dataset.eventsBound === "true") return;
        element.dataset.eventsBound = "true";

        element.addEventListener("click", event => {
            if (event.target.closest("button")) return;
            selectContentElement(element);
        });

        if (element.dataset.type === "text" ||
            element.dataset.type === "template-text" ||
            element.dataset.type === "navigation") {
            element.contentEditable = "true";
            element.addEventListener("input", scheduleHistoryState);
            element.addEventListener("blur", saveHistoryState);
        }
    });

    installCanvasDragDropHandlers();
}

function selectContentElement(element) {
    if (!element || !element.classList.contains("website-content-element")) return;

    if (selectedContentElement) {
        selectedContentElement.classList.remove("selected-content-element");
    }

    selectedContentElement = element;
    selectedContentElement.classList.add("selected-content-element");

    updateTextToolbarState();
}

function applyTextStyle(property, value) {
    if (!selectedContentElement ||
        !["text", "template-text", "navigation"].includes(selectedContentElement.dataset.type)) {
        showMessage("Please select a text element first.", "error");
        return;
    }

    selectedContentElement.style[property] = value;
    saveHistoryState();
    updateTextToolbarState();
}

function toggleTextStyle(property, activeValue, inactiveValue) {
    if (!selectedContentElement ||
        !["text", "template-text", "navigation"].includes(selectedContentElement.dataset.type)) {
        showMessage("Please select a text element first.", "error");
        return;
    }

    selectedContentElement.style[property] =
        selectedContentElement.style[property] === activeValue ? inactiveValue : activeValue;

    saveHistoryState();
    updateTextToolbarState();
}

function updateTextToolbarState() {
    const toolbar = document.getElementById("builderTextToolbar");
    if (!toolbar) return;

    const isText = selectedContentElement &&
        ["text", "template-text", "navigation"].includes(selectedContentElement.dataset.type);

    toolbar.style.opacity = isText ? "1" : ".5";

    if (!isText) return;

    const sizeInput = document.getElementById("builderTextSize");
    const fontInput = document.getElementById("builderTextFont");
    const colorInput = document.getElementById("builderTextColor");

    if (sizeInput) {
        sizeInput.value = parseInt(selectedContentElement.style.fontSize) || 24;
    }

    if (fontInput && selectedContentElement.style.fontFamily) {
        fontInput.value = selectedContentElement.style.fontFamily;
    }

    if (colorInput && selectedContentElement.style.color) {
        colorInput.value = rgbToHex(selectedContentElement.style.color);
    }
}

function rgbToHex(color) {
    if (!color || color.startsWith("#")) return color || "#1f2937";

    const values = color.match(/\d+/g);
    if (!values || values.length < 3) return "#1f2937";

    return "#" + values.slice(0, 3).map(value =>
        Number(value).toString(16).padStart(2, "0")
    ).join("");
}

function createBuilderEditorTools() {
    if (document.getElementById("builderUndoButton")) return;

    const style = document.createElement("style");

    style.textContent = `
        #builderHistoryToolbar,
        #builderTextToolbar {
            display:flex;
            gap:8px;
            align-items:center;
            flex-wrap:wrap;
            margin:12px 0;
            padding:10px;
            background:#fff;
            border:1px solid #e5e7eb;
            border-radius:10px;
        }

        #builderHistoryToolbar button,
        #builderTextToolbar button {
            border:1px solid #d1d5db;
            background:#fff;
            color:#1f2937;
            border-radius:6px;
            padding:7px 10px;
            cursor:pointer;
            font-size:13px;
        }

        #builderHistoryToolbar button:disabled {
            opacity:.4;
            cursor:not-allowed;
        }

        #builderTextToolbar select,
        #builderTextToolbar input {
            max-width:115px;
            min-height:32px;
            border:1px solid #d1d5db;
            border-radius:6px;
            padding:4px;
            background:#fff;
        }

        #builderTextToolbar .format-label {
            display:flex;
            align-items:center;
            gap:5px;
            font-size:12px;
            color:#475569;
        }

        .website-content-element {
            position:relative;
            cursor:pointer;
        }

        .website-content-element.builder-element-dragging {
            opacity:.4;
        }

        .website-content-element.builder-drop-before {
            border-top:3px solid #2563eb !important;
        }

        .website-content-element.builder-drop-after {
            border-bottom:3px solid #2563eb !important;
        }
    `;

    document.head.appendChild(style);

    const historyToolbar = document.createElement("div");
    historyToolbar.id = "builderHistoryToolbar";
    historyToolbar.innerHTML = `
        <button type="button" id="builderUndoButton" disabled>↶ Undo</button>
        <button type="button" id="builderRedoButton" disabled>↷ Redo</button>
    `;

    const textToolbar = document.createElement("div");
    textToolbar.id = "builderTextToolbar";
    textToolbar.innerHTML = `
        <strong style="width:100%;font-size:13px;">Text Formatting</strong>
        <button type="button" id="builderBoldButton"><b>B</b></button>
        <button type="button" id="builderItalicButton"><i>I</i></button>
        <button type="button" id="builderUnderlineButton"><u>U</u></button>
        <label class="format-label">Size
            <input id="builderTextSize" type="number" min="8" max="96" value="24">
        </label>
        <label class="format-label">Font
            <select id="builderTextFont">
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Tahoma">Tahoma</option>
                <option value="'Trebuchet MS'">Trebuchet</option>
                <option value="'Times New Roman'">Times New Roman</option>
            </select>
        </label>
        <label class="format-label">Color
            <input id="builderTextColor" type="color" value="#1f2937">
        </label>
        <button type="button" id="builderAlignLeft">≡ Left</button>
        <button type="button" id="builderAlignCenter">≡ Center</button>
        <button type="button" id="builderAlignRight">≡ Right</button>
    `;

    const customizationPanel = document.querySelector(".builder-right-panel");

    if (customizationPanel) {
        customizationPanel.insertBefore(historyToolbar, customizationPanel.firstChild);
        customizationPanel.appendChild(textToolbar);
    } else if (websiteCanvas?.parentElement) {
        websiteCanvas.parentElement.insertBefore(historyToolbar, websiteCanvas);
        websiteCanvas.parentElement.insertBefore(textToolbar, websiteCanvas);
    }

    document.getElementById("builderUndoButton")?.addEventListener("click", undoBuilderChange);
    document.getElementById("builderRedoButton")?.addEventListener("click", redoBuilderChange);

    document.getElementById("builderBoldButton")?.addEventListener("click", () => {
        toggleTextStyle("fontWeight", "700", "400");
    });

    document.getElementById("builderItalicButton")?.addEventListener("click", () => {
        toggleTextStyle("fontStyle", "italic", "normal");
    });

    document.getElementById("builderUnderlineButton")?.addEventListener("click", () => {
        toggleTextStyle("textDecoration", "underline", "none");
    });

    document.getElementById("builderTextSize")?.addEventListener("change", event => {
        const size = Math.min(96, Math.max(8, Number(event.target.value) || 24));
        applyTextStyle("fontSize", `${size}px`);
    });

    document.getElementById("builderTextFont")?.addEventListener("change", event => {
        applyTextStyle("fontFamily", event.target.value);
    });

    document.getElementById("builderTextColor")?.addEventListener("input", event => {
        applyTextStyle("color", event.target.value);
    });

    document.getElementById("builderAlignLeft")?.addEventListener("click", () => {
        applyTextStyle("textAlign", "left");
    });

    document.getElementById("builderAlignCenter")?.addEventListener("click", () => {
        applyTextStyle("textAlign", "center");
    });

    document.getElementById("builderAlignRight")?.addEventListener("click", () => {
        applyTextStyle("textAlign", "right");
    });
}

if (!token) {
    window.location.href = "login.html";
}

if (token && sellerData?.name) {
    if (sellerNameElement) sellerNameElement.textContent = sellerData.name;

    if (userAvatarElement) {
        userAvatarElement.textContent = sellerData.name.charAt(0).toUpperCase();
    }
}

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("sellerData");
        window.location.href = "login.html";
    });
}

function showMessage(message, type = "success") {
    if (!builderMessage) return;

    builderMessage.textContent = message;
    builderMessage.className = `builder-message ${type}`;
    builderMessage.style.display = "block";

    setTimeout(() => {
        builderMessage.style.display = "none";
    }, 3000);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function getWebsiteTitle() {
    return websiteTitleInput?.value.trim() || "My Online Store";
}

function updateWebsiteAppearance() {
    if (!websiteCanvas) return;

    const primary = primaryColorInput?.value || "#2563eb";
    const secondary = secondaryColorInput?.value || "#eff6ff";
    const font = websiteFontInput?.value || "Arial";

    websiteCanvas.style.setProperty("--store-primary", primary);
    websiteCanvas.style.setProperty("--store-secondary", secondary);
    websiteCanvas.style.setProperty("--store-font", font);
    websiteCanvas.style.fontFamily = font;
}

function getTemplateStyles() {
    return `
        #websiteCanvas {
            --store-primary:#2563eb;
            --store-secondary:#eff6ff;
            --store-font:Arial;
            font-family:var(--store-font);
            color:#1f2937;
            background:#fff;
            min-height:500px;
            padding:20px;
            box-sizing:border-box;
        }

        .template-store-layout {
            width:100%;
            min-height:450px;
            overflow:hidden;
            background:#fff;
        }

        .template-store-header {
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:20px;
            padding:20px 5%;
            border-bottom:1px solid #e5e7eb;
        }

        .template-store-header .store-name {
            font-size:23px;
            font-weight:700;
            color:var(--store-primary);
        }

        .template-store-header .store-nav {
            display:flex;
            gap:20px;
            flex-wrap:wrap;
            color:#475569;
            font-size:14px;
        }

        .template-hero {
            background:var(--store-secondary);
            padding:65px 8%;
            text-align:center;
        }

        .template-hero h1 {
            font-size:clamp(28px,4vw,48px);
            margin:0 0 15px;
            color:#172033;
        }

        .template-hero p {
            font-size:16px;
            color:#475569;
            margin:0 auto 25px;
            max-width:600px;
            line-height:1.7;
        }

        .template-hero button {
            background:var(--store-primary);
            color:#fff;
            border:0;
            border-radius:7px;
            padding:13px 25px;
            font-size:14px;
            cursor:pointer;
        }

        .template-products-section {
            padding:45px 5%;
        }

        .template-products-section h2 {
            text-align:center;
            font-size:28px;
            margin:0 0 30px;
        }

        .template-products-grid {
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
            gap:18px;
        }

        .template-product-card {
            border:1px solid #e5e7eb;
            border-radius:10px;
            overflow:hidden;
            padding:18px;
            background:#fff;
        }

        .template-product-card h3 {
            font-size:16px;
            margin:0 0 10px;
        }

        .template-product-card p {
            color:var(--store-primary);
            font-weight:700;
            margin:0;
        }

        .website-content-element {
            position:relative;
            margin:12px 0;
            padding:12px;
            border:1px dashed transparent;
            border-radius:5px;
            cursor:pointer;
        }

        .website-content-element:hover {
            border-color:#93c5fd;
        }

        .website-content-element.selected-content-element {
            border:2px solid #2563eb;
            background:rgba(219,234,254,.15);
        }

        .builder-image-placeholder {
            display:flex;
            justify-content:center;
            align-items:center;
            min-height:140px;
            padding:20px;
            background:#f1f5f9;
            border:1px dashed #94a3b8;
            color:#64748b;
            text-align:center;
        }

        .builder-added-button {
            display:inline-block;
            background:var(--store-primary);
            color:white;
            border:0;
            border-radius:6px;
            padding:12px 22px;
            cursor:pointer;
        }

        .minimal-store .template-hero {
            background:#f8fafc;
        }

        .fashion-store .template-hero {
            background:var(--store-secondary);
        }

        @media(max-width:650px) {
            .template-store-header {
                align-items:flex-start;
                flex-direction:column;
            }

            .template-store-header .store-nav {
                gap:12px;
            }

            .template-hero {
                padding:40px 6%;
            }

            .template-products-section {
                padding:30px 4%;
            }
        }
    `;
}

function installTemplateStyles() {
    if (document.getElementById("builderTemplateStyles")) return;

    const style = document.createElement("style");
    style.id = "builderTemplateStyles";
    style.textContent = getTemplateStyles();

    document.head.appendChild(style);
}

async function fetchSellerProducts() {
    try {
        const response = await fetch("/api/products", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load products.");
        }

        return data.products || [];
    } catch (error) {
        console.error("Product loading error:", error);
        showMessage("Unable to load your products.", "error");
        return [];
    }
}

async function displayProducts(container) {
    if (!container) return;

    container.innerHTML = "";

    const products = await fetchSellerProducts();

    if (!products.length) {
        container.innerHTML = "<p>No products added yet.</p>";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "template-product-card website-content-element";
        card.dataset.type = "product-card";

        const name = document.createElement("h3");
        name.textContent = product.name || "Product";

        const price = document.createElement("p");
        price.textContent = `PKR ${product.price ?? 0}`;

        card.appendChild(name);
        card.appendChild(price);
        container.appendChild(card);
    });

    bindCanvasElementEvents();
}

function makeEditable(element, type = "template-text") {
    if (!element) return;

    element.classList.add("website-content-element");
    element.dataset.type = type;
    element.contentEditable = "true";
    element.spellcheck = true;

    enableElementDragging(element);
}

function createStoreHeader() {
    const header = document.createElement("header");
    header.className = "template-store-header website-content-element";
    header.dataset.type = "store-header";

    const storeName = document.createElement("div");
    storeName.className = "store-name website-content-element";
    storeName.dataset.type = "template-text";
    storeName.textContent = getWebsiteTitle();
    storeName.contentEditable = "true";

    const nav = document.createElement("nav");
    nav.className = "store-nav website-content-element";
    nav.dataset.type = "navigation";
    nav.contentEditable = "true";

    ["Home", "Shop", "About", "Contact"].forEach(label => {
        const link = document.createElement("span");
        link.textContent = label;
        nav.appendChild(link);
    });

    header.appendChild(storeName);
    header.appendChild(nav);

    return header;
}

function createHeroSection(template) {
    const hero = document.createElement("section");
    hero.className = "template-hero website-content-element";
    hero.dataset.type = "hero-section";

    const heading = document.createElement("h1");
    heading.textContent = template.title;
    makeEditable(heading);

    const description = document.createElement("p");
    description.textContent = template.subtitle;
    makeEditable(description);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = template.button;
    button.className = "website-content-element";
    button.dataset.type = "template-button";
    button.contentEditable = "true";

    hero.appendChild(heading);
    hero.appendChild(description);
    hero.appendChild(button);

    enableElementDragging(hero);

    return hero;
}

function createProductsSection() {
    const section = document.createElement("section");
    section.className = "template-products-section website-content-element";
    section.dataset.type = "products-section";

    const heading = document.createElement("h2");
    heading.textContent = "Our Products";
    makeEditable(heading);

    const grid = document.createElement("div");
    grid.className = "template-products-grid";

    section.appendChild(heading);
    section.appendChild(grid);

    displayProducts(grid);
    enableElementDragging(section);

    return section;
}

function applyTemplate(templateName) {
    const template = templateConfigs[templateName];

    if (!template || !websiteCanvas) return;

    selectedTemplate = templateName;
    selectedContentElement = null;

    websiteCanvas.innerHTML = "";

    const layout = document.createElement("div");
    layout.className = `template-store-layout ${template.className || ""}`;

    layout.appendChild(createStoreHeader());
    layout.appendChild(createHeroSection(template));
    layout.appendChild(createProductsSection());

    websiteCanvas.appendChild(layout);

    if (primaryColorInput) primaryColorInput.value = template.primary;
    if (secondaryColorInput) secondaryColorInput.value = template.secondary;
    if (websiteFontInput) websiteFontInput.value = template.font;

    updateWebsiteAppearance();
    bindCanvasElementEvents();

    document.querySelectorAll("[data-template]").forEach(button => {
        button.classList.toggle(
            "selected",
            button.dataset.template === templateName
        );
    });

    if (canvasEmptyState) canvasEmptyState.style.display = "none";

    saveHistoryState();
}

async function addElement(type, savedContent = null) {
    if (!websiteCanvas) return;

    if (canvasEmptyState) canvasEmptyState.style.display = "none";

    const element = document.createElement("div");
    element.className = "website-content-element";
    element.dataset.type = type;

    if (type === "text") {
        element.textContent = savedContent?.text || "Edit this text";
        element.contentEditable = "true";
        element.style.fontSize = savedContent?.fontSize || "24px";
    }

    if (type === "image") {
        element.classList.add("builder-image-placeholder");
        element.textContent = "Image Placeholder";
    }

    if (type === "button") {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "builder-added-button";
        button.textContent = savedContent?.text || "Click Here";
        element.appendChild(button);
    }

    if (type === "product") {
        const products = await fetchSellerProducts();

        if (products.length) {
            const product = products[0];

            const name = document.createElement("h3");
            name.textContent = product.name || "Product";

            const price = document.createElement("p");
            price.textContent = `PKR ${product.price ?? 0}`;

            element.appendChild(name);
            element.appendChild(price);
        } else {
            element.textContent = "No products available. Add products first.";
        }
    }

    enableElementDragging(element);
    websiteCanvas.appendChild(element);

    bindCanvasElementEvents();
    selectContentElement(element);
    saveHistoryState();
}

document.querySelectorAll("[data-element]").forEach(button => {
    button.addEventListener("click", () => {
        addElement(button.dataset.element);
    });
});

document.querySelectorAll("[data-template]").forEach(button => {
    button.addEventListener("click", () => {
        applyTemplate(button.dataset.template);
    });
});

document.querySelectorAll("[data-device]").forEach(button => {
    button.addEventListener("click", () => {
        const device = button.dataset.device;

        document.querySelectorAll("[data-device]").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        if (!websiteCanvas) return;

        if (device === "mobile") {
            websiteCanvas.style.width = "375px";
        } else if (device === "tablet") {
            websiteCanvas.style.width = "768px";
        } else {
            websiteCanvas.style.width = "100%";
        }
    });
});

[websiteTitleInput, primaryColorInput, secondaryColorInput, websiteFontInput].forEach(input => {
    if (!input) return;

    input.addEventListener("input", () => {
        updateWebsiteAppearance();
        scheduleHistoryState();
    });
});

if (websiteTitleInput) {
    websiteTitleInput.addEventListener("input", () => {
        const storeName = websiteCanvas?.querySelector(".store-name");

        if (storeName) storeName.textContent = getWebsiteTitle();
    });
}

function getDraftData() {
    const elements = [];

    websiteCanvas?.querySelectorAll(".website-content-element").forEach(element => {
        elements.push({
            type: element.dataset.type,
            text: element.innerText,
            html: element.innerHTML,
            style: element.getAttribute("style") || ""
        });
    });

    return {
        title: getWebsiteTitle(),
        primaryColor: primaryColorInput?.value || "#2563eb",
        secondaryColor: secondaryColorInput?.value || "#eff6ff",
        font: websiteFontInput?.value || "Arial",
        selectedTemplate,
        canvasHTML: websiteCanvas?.innerHTML || "",
        elements,
        updatedAt: new Date().toISOString()
    };
}

function saveWebsiteDraft() {
    try {
        const draft = getDraftData();

        localStorage.setItem("websiteBuilderDraft", JSON.stringify(draft));

        showMessage("Website draft saved successfully.", "success");
        saveHistoryState();
    } catch (error) {
        console.error("Draft saving error:", error);
        showMessage("Unable to save website draft.", "error");
    }
}

function getPreviewHTML() {
    const clone = websiteCanvas.cloneNode(true);

    clone.querySelectorAll(".selected-content-element").forEach(element => {
        element.classList.remove("selected-content-element");
    });

    clone.querySelectorAll(".builder-element-dragging").forEach(element => {
        element.classList.remove("builder-element-dragging");
    });

    clone.querySelectorAll(".builder-drop-before, .builder-drop-after").forEach(element => {
        element.classList.remove("builder-drop-before", "builder-drop-after");
    });

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${escapeHTML(getWebsiteTitle())}</title>
            <style>
                ${getTemplateStyles()}
                body {
                    margin:0;
                    padding:20px;
                    background:#f1f5f9;
                }
                #websiteCanvas {
                    max-width:1200px;
                    margin:0 auto;
                    background:#fff;
                    min-height:500px;
                    padding:20px;
                    box-sizing:border-box;
                }
                .website-content-element {
                    border:0 !important;
                    cursor:default;
                }
            </style>
        </head>
        <body>
            <main id="websiteCanvas"
                style="
                    --store-primary:${escapeHTML(primaryColorInput?.value || "#2563eb")};
                    --store-secondary:${escapeHTML(secondaryColorInput?.value || "#eff6ff")};
                    --store-font:${escapeHTML(websiteFontInput?.value || "Arial")};
                ">
                ${clone.innerHTML}
            </main>
        </body>
        </html>
    `;
}

function previewWebsite() {
    if (!websiteCanvas || !websiteCanvas.innerHTML.trim()) {
        showMessage("Please add a template or elements before previewing.", "error");
        return;
    }

    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
        showMessage("Please allow pop-ups to open website preview.", "error");
        return;
    }

    previewWindow.document.open();
    previewWindow.document.write(getPreviewHTML());
    previewWindow.document.close();
}

function loadSavedDraft() {
    const savedDraft = localStorage.getItem("websiteBuilderDraft");

    if (!savedDraft) return;

    try {
        const draft = JSON.parse(savedDraft);

        if (websiteTitleInput) websiteTitleInput.value = draft.title || "";
        if (primaryColorInput) primaryColorInput.value = draft.primaryColor || "#2563eb";
        if (secondaryColorInput) secondaryColorInput.value = draft.secondaryColor || "#eff6ff";
        if (websiteFontInput) websiteFontInput.value = draft.font || "Arial";

        if (draft.canvasHTML && websiteCanvas) {
            websiteCanvas.innerHTML = draft.canvasHTML;
        } else if (draft.selectedTemplate && templateConfigs[draft.selectedTemplate]) {
            applyTemplate(draft.selectedTemplate);
        }

        selectedTemplate = draft.selectedTemplate || null;

        updateWebsiteAppearance();
        bindCanvasElementEvents();

        if (canvasEmptyState && websiteCanvas?.innerHTML.trim()) {
            canvasEmptyState.style.display = "none";
        }
    } catch (error) {
        console.error("Unable to load saved website draft:", error);
    }
}

if (saveWebsiteButton) {
    saveWebsiteButton.addEventListener("click", saveWebsiteDraft);
}

if (previewWebsiteButton) {
    previewWebsiteButton.addEventListener("click", previewWebsite);
}

if (startBuildingButton) {
    startBuildingButton.addEventListener("click", () => {
        const firstElementButton = document.querySelector("[data-element='text']");

        if (firstElementButton) {
            firstElementButton.click();
        } else {
            addElement("text");
        }
    });
}

installTemplateStyles();
loadSavedDraft();

historyStack = [];
historyIndex = -1;

createBuilderEditorTools();
bindCanvasElementEvents();
saveHistoryState();