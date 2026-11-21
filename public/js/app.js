
const signupForm = document.getElementById("signupForm");
const formMessage = document.getElementById("formMessage");
const loginLink = document.getElementById("loginLink");

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const submitButton = signupForm.querySelector("button[type='submit']");

    // Check password length
    if (password.length < 8) {
        showMessage("Password must be at least 8 characters.", "error");
        return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
        showMessage("Passwords do not match. Please try again.", "error");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Creating Account...";

    formMessage.className = "form-message";

    try {
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to create account.");
        }

        showMessage(
            "Your account has been created successfully!",
            "success"
        );

        signupForm.reset();

    } catch (error) {
        showMessage(error.message, "error");

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Create Account";
    }
});

// Login is not implemented yet
loginLink.addEventListener("click", (event) => {
    event.preventDefault();

    showMessage(
        "Login functionality will be available soon.",
        "error"
    );
});
