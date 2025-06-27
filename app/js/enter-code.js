document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form");
    const codeInput = document.getElementById("verify-code");
    const codeError = document.getElementById("code-error");
    const submitError = document.getElementById("submit-error");

    // تأكد أن الكود هو 6 أرقام فقط
    function validateCodeInput() {
        const code = codeInput.value.trim();
        if (code.length === 0) {
            codeError.textContent = "الرجاء إدخال رمز التحقق";
            return false;
        }
        if (!/^\d{6}$/.test(code)) {
            codeError.textContent = "رمز التحقق يجب أن يكون مكونًا من 6 أرقام";
            return false;
        }
        codeError.textContent = "";
        return true;
    }

    codeInput.addEventListener("input", validateCodeInput);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        submitError.style.display = "none";

        if (!validateCodeInput()) {
            submitError.style.color = "red";
            submitError.style.display = "block";
            submitError.textContent = "يرجى تصحيح رمز التحقق";
            setTimeout(() => (submitError.style.display = "none"), 3000);
            return;
        }

        const otp = codeInput.value.trim();

        fetch("http://localhost:5000/api/v1/user/vrefiyotp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ otp }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("فشل التحقق من رمز التحقق");
                }
            if (response.ok) {
                window.location.href = "http://localhost:5000/";
            }
                return response.json();
            })
            .then((data) => {
                submitError.style.color = "green";
                submitError.style.display = "block";
                submitError.textContent = "تم التحقق بنجاح";
                // هنا يمكنك إضافة أي عملية تريدها بعد النجاح، مثلاً إعادة توجيه الصفحة
                setTimeout(() => (submitError.style.display = "none"), 4000);
            })
            .catch((error) => {
                submitError.style.color = "red";
                submitError.style.display = "block";
                submitError.textContent = "حدث خطأ أثناء التحقق، حاول مرة أخرى";
                console.error("Error:", error);
                setTimeout(() => (submitError.style.display = "none"), 3000);
            });
    });
});