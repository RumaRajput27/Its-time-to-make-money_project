const API_URL = 'http://localhost:3000';

document.addEventListener("DOMContentLoaded", () => {
    // Select forms and sections
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const expenseForm = document.getElementById("expense-form");
    const registerSection = document.getElementById("register-section");
    const loginSection = document.getElementById("login-section");
    const expenseSection = document.getElementById("expense-section");
    const expenseList = document.getElementById("expense-list");
    const logoutButton = document.getElementById("logout-button");

    let token = localStorage.getItem("token");

    // Show or hide sections based on login status
    if (token) {
        showExpenseSection();
        loadExpenses();
    } else {
        showLoginRegisterSection();
    }

    // Register user
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("register-username").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            alert(data.message || "Registration successful");
        } catch (error) {
            alert("Error registering user");
        }
    });

    // Login user
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.token) {
                token = data.token;
                localStorage.setItem("token", token);
                showExpenseSection();
                loadExpenses();
            } else {
                alert("Invalid login credentials");
            }
        } catch (error) {
            alert("Error logging in");
        }
    });

    // Add expense
    expenseForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const description = document.getElementById("description").value;
        const amount = document.getElementById("amount").value;
        const date = document.getElementById("date").value;

        try {
            await fetch(`${API_URL}/expenses/add`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ description, amount, date })
            });
            loadExpenses();
        } catch (error) {
            alert("Error adding expense");
        }
    });

    // Logout
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        token = null;
        showLoginRegisterSection();
    });

    // Load expenses
    async function loadExpenses() {
        try {
            const response = await fetch(`${API_URL}/expenses/list`, {
                headers: { "Authorization": token }
            });
            const expenses = await response.json();
            expenseList.innerHTML = "";
            expenses.forEach(expense => {
                const li = document.createElement("li");
                li.textContent = `${expense.description} - $${expense.amount} on ${expense.date}`;
                expenseList.appendChild(li);
            });
        } catch (error) {
            alert("Error loading expenses");
        }
    }

    // Helper functions
    function showExpenseSection() {
        registerSection.style.display = "none";
        loginSection.style.display = "none";
        expenseSection.style.display = "block";
    }

    function showLoginRegisterSection() {
        registerSection.style.display = "block";
        loginSection.style.display = "block";
        expenseSection.style.display = "none";
    }

    document.getElementById('buy-premium-btn').addEventListener('click', function() {
        // You can either open a Razorpay modal here or redirect to a payment page
        alert('Redirecting to payment...');
    
        // Example: Redirect to Razorpay payment page or call API
        // For Razorpay integration, you'd add your payment logic here
    });
});
