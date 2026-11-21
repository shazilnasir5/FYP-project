
const loginForm = document.getElementById("loginForm");
const formMessage = document.getElementById("formMessage");

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const submitButton = loginForm.querySelector("button[type='submit']");

    submitButton.disabled = true;
    submitButton.textContent = "Logging In...";

    formMessage.className = "form-message";

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }

        // Save JWT token
        localStorage.setItem("sellerToken", data.token);

        // Save seller information
        localStorage.setItem(
            "sellerData",
            JSON.stringify(data.seller)
        );

        showMessage("Login successful! Redirecting...", "success");

        // Redirect to Dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        showMessage(error.message, "error");

        submitButton.disabled = false;
        submitButton.textContent = "Log In";
    }
});
