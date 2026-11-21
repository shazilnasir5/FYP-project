
const token = localStorage.getItem("sellerToken");

const sellerData = JSON.parse(
    localStorage.getItem("sellerData") || "null"
);

const sellerNameElement = document.getElementById("sellerName");
const welcomeNameElement = document.getElementById("welcomeName");
const userAvatarElement = document.getElementById("userAvatar");
const totalProductsElement = document.getElementById("totalProducts");
const logoutButton = document.getElementById("logoutButton");

// Check login session
if (!token) {
    window.location.href = "login.html";
} else {

    // Display seller information
    if (sellerData && sellerData.name) {
        const name = sellerData.name;

        sellerNameElement.textContent = name;
        welcomeNameElement.textContent = name;
        userAvatarElement.textContent = name.charAt(0).toUpperCase();
    }

    // Load dashboard data from backend
    async function loadDashboard() {
        try {
            const response = await fetch("/api/dashboard", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Session verification failed."
                );
            }

            // Display actual product count
            totalProductsElement.textContent =
                data.stats.totalProducts;

            console.log("Dashboard loaded successfully.");

        } catch (error) {
            console.error("Dashboard error:", error.message);

            localStorage.removeItem("sellerToken");
            localStorage.removeItem("sellerData");

            window.location.href = "login.html";
        }
    }

    loadDashboard();
}

// Logout
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerData");

    window.location.href = "login.html";
});
