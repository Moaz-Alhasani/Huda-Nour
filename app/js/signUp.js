          document.getElementById("sign-in").addEventListener("click", function() {
            window.location.href = "http://localhost:5000/api/v1/user/login";
        });
        // تعريف الأخطاء
        var firstNameError = document.getElementById("first-name-error");
        var lastNameError = document.getElementById("last-name-error");
        var emailError = document.getElementById("email-error");
        var passwordError = document.getElementById("password-error");
        var submitError = document.getElementById("submit-error");

        // الحقول
        var inputFields = document.querySelectorAll(".form__input-group input");

        // تغيير مظهر الحقول عند التركيز
        inputFields.forEach(e => {
            e.addEventListener("focus", function () {
                e.style.backgroundColor = "#2ca4ab";
                e.style.color = "white";
                e.classList.add("custom-placeholder");
                e.parentNode.children[0].style.display = "none";
                e.parentNode.children[1].style.display = "block";
            });

            e.addEventListener("blur", function () {
                e.style.backgroundColor = "white";
                e.style.color = "#2ca4ab";
                e.classList.remove("custom-placeholder");
                e.parentNode.children[1].style.display = "none";
                e.parentNode.children[0].style.display = "block";
            });
        });

        // التحقق من الاسم الأول
            function validateFirstName() {
                var firstNameValue = document.getElementById("firstName").value.trim();
                if (firstNameValue.length == 0) {
                    firstNameError.innerHTML = "الاسم الأول مطلوب";
                    return false;
                }
                if (!firstNameValue.match(/^[\u0621-\u064A]{2,}$/)) {
                    firstNameError.innerHTML = "يجب أن يكون الاسم الأول باللغة العربية";
                    return false;
                }
                firstNameError.innerHTML = "";
                return true;
            }

// التحقق من الاسم الأخير
        function validateLastName() {
            var lastNameValue = document.getElementById("lastName").value.trim();
            if (lastNameValue.length == 0) {
                lastNameError.innerHTML = "الاسم الأخير مطلوب";
                return false;
            }
            if (!lastNameValue.match(/^[\u0621-\u064A]{2,}$/)) {
                lastNameError.innerHTML = "يجب أن يكون الاسم الأخير باللغة العربية";
                return false;
            }
            lastNameError.innerHTML = "";
            return true;
        }

        // التحقق من الإيميل
        function validateEmail() {
            var emailValue = document.getElementById("email").value;
            if (emailValue.length == 0) {
                emailError.innerHTML = "الإيميل مطلوب";
                return false;
            }
            if (!emailValue.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
                emailError.innerHTML = "صيغة الإيميل غير صحيحة";
                return false;
            }
            emailError.innerHTML = "";
            return true;
        }

        // التحقق من كلمة المرور
        function validatePassword() {
            var passwordValue = document.getElementById("password").value;
            if (passwordValue.length == 0) {
                passwordError.innerHTML = "كلمة السر مطلوبة";
                return false;
            }
            if (!passwordValue.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
                passwordError.innerHTML = 'كلمة السر ضعيفة';
                return false;
            }
            passwordError.innerHTML = "";
            return true;
        }

        // عند إرسال النموذج
        document.getElementById("signupForm").addEventListener("submit", async function (event) {
            event.preventDefault(); // منع الإرسال الافتراضي

            if (!validateFirstName() || !validateLastName() || !validateEmail() || !validatePassword()) {
                submitError.style.display = "block";
                submitError.innerHTML = "أصلح الأخطاء للتسجيل";
                setTimeout(() => {
                    submitError.style.display = "none";
                }, 3000);
                return false;
            }

            submitError.style.display = "none";

                const data = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                };
            console.log(data)

            try {
                const res = await fetch("http://localhost:5000/api/v1/user/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                const response = await res.json();

                if (res.ok) {
                   
                    window.location.href = "http://localhost:5000/";
                } else {
                    submitError.style.display = "block";
                    submitError.innerHTML = response.message || "فشل في التسجيل";
                }

            } catch (err) {
                console.error(err);
                alert("حدث خطأ أثناء التسجيل");
            }
        });