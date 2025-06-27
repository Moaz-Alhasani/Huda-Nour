// DOM Elements
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
const submitError = document.getElementById("submit-error");
const inputFields = document.querySelectorAll(".form__input-group input");
const passwordResetForm = document.getElementById("passwordResetForm");

// Input field focus/blur effects (same as login)
inputFields.forEach(input => {
    input.addEventListener("focus", function () {
        this.style.backgroundColor = "#2ca4ab";
        this.style.color = "white";
        this.classList.add("custom-placeholder");

        // Toggle icons
        const parent = this.parentNode;
        parent.children[0].style.display = "none"; // Default icon
        parent.children[1].style.display = "block"; // Active icon
    });

    input.addEventListener("blur", function () {
        this.style.backgroundColor = "white";
        this.style.color = "#2ca4ab";
        this.classList.remove("custom-placeholder");

        // Toggle icons
        const parent = this.parentNode;
        parent.children[1].style.display = "none"; // Active icon
        parent.children[0].style.display = "block"; // Default icon
    });
});

// Password validation (same as signup)
// Password validation (simplified for login)
function validatePassword() {
const passwordValue = document.getElementById("new-password").value;
    if (!passwordValue) {
        passwordError.innerHTML = "كلمة المرور مطلوبة";
        return false;
    }

    // Add the regex check here if needed:
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passwordValue)) {
        passwordError.innerHTML = 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص';
        return false;
    }
 

    passwordError.innerHTML = "";
    return true;
}

// Confirm password validation
function validateConfirmPassword() {
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!confirmPassword) {
        confirmPasswordError.innerHTML = "تأكيد كلمة المرور مطلوب";
        return false;
    }

    if (password !== confirmPassword) {
        confirmPasswordError.innerHTML = "كلمة المرور غير متطابقة";
        return false;
    }

    confirmPasswordError.innerHTML = "";
    return true;
}

// Form submission handler
async function handleSubmit(e) {
    e.preventDefault();

    // Validate form
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!isPasswordValid || !isConfirmPasswordValid) {
        submitError.style.display = "block";
        submitError.innerHTML = "الرجاء تصحيح الأخطاء قبل المتابعة";
        setTimeout(() => { submitError.style.display = "none"; }, 3000);
        return;
    }

    // Prepare form data
    const formData = {
        newPassword: document.getElementById("new-password").value,
        // You might need to include a reset token from the URL
        token: new URLSearchParams(window.location.search).get('token')
    };

    try {
        // Show loading state
        const submitBtn = document.getElementById("reset-password");
        submitBtn.disabled = true;
        submitBtn.textContent = "جاري تحديث كلمة المرور...";

        // Send password reset request
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "فشل تحديث كلمة المرور. الرجاء المحاولة مرة أخرى");
        }

        // Show success message
        submitError.style.color = "green";
        submitError.style.display = "block";
        submitError.innerHTML = data.message || "تم تحديث كلمة المرور بنجاح";

        // Redirect to login page after 3 seconds
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 3000);

    } catch (error) {
        console.error("Password reset error:", error);
        submitError.style.display = "block";
        submitError.innerHTML = error.message || "حدث خطأ أثناء تحديث كلمة المرور";
        setTimeout(() => { submitError.style.display = "none"; }, 3000);

        // Reset submit button
        const submitBtn = document.getElementById("reset-password");
        submitBtn.disabled = false;
        submitBtn.textContent = "تغيير كلمة المرور";
    }
}

// Event listeners
if (passwordResetForm) {
    passwordResetForm.addEventListener("submit", handleSubmit);
}

// Back to login button handler
document.getElementById("back-to-login").addEventListener("click", function () {
    window.location.href = '/login.html';
});

// Optional: Add Enter key submission
inputFields.forEach(input => {
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    });
});