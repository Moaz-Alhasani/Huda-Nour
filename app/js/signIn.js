 document.getElementById("sign-up").addEventListener("click", function() {
        window.location.href = "http://localhost:5000/api/v1/user/register";
        });


     document.getElementById("form__forget-password").addEventListener("click", function() {
        window.location.href = "http://localhost:5000/api/v1/user/forgotpassword";
        });

    var emailError = document.getElementById("email-error");
    var passwordError = document.getElementById("password-error");
    var submitError = document.getElementById("submit-error");
    var inputFields = document.querySelectorAll(".form__input-group input");

    // تغيير صورة الأيقونات عند التركيز وفقدانه
    inputFields.forEach(input => {
        input.addEventListener("focus", () => {
            input.style.backgroundColor = "#2ca4ab";
            input.style.color = "white";
            input.classList.add("custom-placeholder");
            const imgs = input.parentNode.querySelectorAll("img");
            if (imgs.length === 2) {
                imgs[0].style.display = "none";
                imgs[1].style.display = "block";
            }
        });
        input.addEventListener("blur", () => {
            input.style.backgroundColor = "white";
            input.style.color = "#2ca4ab";
            input.classList.remove("custom-placeholder");
            const imgs = input.parentNode.querySelectorAll("img");
            if (imgs.length === 2) {
                imgs[1].style.display = "none";
                imgs[0].style.display = "block";
            }
        });
    });

    function validateEmail() {
        var emailValue = document.getElementById("email").value.trim();
        if (emailValue.length === 0) {
            emailError.textContent = "الإيميل مطلوب";
            return false;
        }
        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailValue)) {
            emailError.textContent = "الإيميل غير صالح";
            return false;
        }
        emailError.textContent = "";
        return true;
    }

    function validatePassword() {
        var passwordValue = document.getElementById("password").value;
        if (passwordValue.length === 0) {
            passwordError.textContent = "كلمة السر مطلوبة";
            return false;
        }
        passwordError.textContent = "";
        return true;
    }

    function validateForm() {
        if (!validateEmail() || !validatePassword()) {
            submitError.style.display = "block";
            submitError.textContent = "أصلح الخطأ للتسجيل";
            setTimeout(() => { submitError.style.display = "none"; }, 3000);
            return false;  // يمنع إرسال الفورم
        }
        return true;  // يسمح بالإرسال
    }

    // إرسال بيانات تسجيل الدخول عبر fetch لمنع إعادة تحميل الصفحة
    document.getElementById("sign-in-form").addEventListener("submit", async function(event) {
        event.preventDefault(); // يمنع إعادة تحميل الصفحة

        // تحقق من صحة البيانات أولاً
        if (!validateForm()) {
            return; // اذا فشل التحقق لا ترسل البيانات
        }

        // جهز البيانات للإرسال
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch('http://localhost:5000/api/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'  // إرسال بيانات JSON
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                // تسجيل الدخول ناجح - يمكنك التوجيه أو عرض رسالة نجاح
                // مثال: إعادة توجيه
                window.location.href = "http://localhost:5000/";
            } else {
                // خطأ في تسجيل الدخول، عرض رسالة الخطأ
                submitError.style.display = "block";
                submitError.textContent = result.message || "حدث خطأ أثناء تسجيل الدخول";
                setTimeout(() => { submitError.style.display = "none"; }, 4000);
            }
        } catch (error) {
            submitError.style.display = "block";
            submitError.textContent = "تعذر الاتصال بالخادم. حاول مرة أخرى.";
            setTimeout(() => { submitError.style.display = "none"; }, 4000);
        }
    });