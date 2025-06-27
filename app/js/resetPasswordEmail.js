document.getElementById("sign-in").addEventListener("click", function() {
        window.location.href = "http://localhost:5000/api/v1/user/vrefiyotp";
        });

        var emailError = document.getElementById("email-error");
        var submitError = document.getElementById("submit-error");
        var inputFields = document.querySelectorAll(".form__input-group input");

        inputFields.forEach(e => {
            e.addEventListener("focus", function () {
                e.style.backgroundColor = "#2ca4ab";
                e.style.color = "white";
                e.classList.add("custom-placeholder");
                e.parentNode.children[0].style.display = "none";
                e.parentNode.children[1].style.display = "block";
            });
        });

        inputFields.forEach(e => {
            e.addEventListener("blur", function () {
                e.style.backgroundColor = "white";
                e.style.color = "#2ca4ab";
                e.classList.remove("custom-placeholder");
                e.parentNode.children[1].style.display = "none";
                e.parentNode.children[0].style.display = "block";
            });
        });

        function validateEmail() {
            var emailValue = document.getElementById("email").value.trim();
            if (emailValue.length === 0) {
                emailError.innerHTML = "الإيميل مطلوب";
                return false;
            }
            if (!emailValue.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
                emailError.innerHTML = "الإيميل غير صالح";
                return false;
            }
            emailError.innerHTML = "";
            return true;
        }

        function validateForm() {
            submitError.style.display = "none";
            if (!validateEmail()) {
                submitError.style.color = "red";
                submitError.style.display = "block";
                submitError.innerHTML = "أصلح الخطأ للتسجيل";
                setTimeout(() => { submitError.style.display = "none"; }, 3000);
                return false;
            }

            var emailValue = document.getElementById("email").value.trim();

            fetch('http://localhost:5000/api/v1/user/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailValue })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('خطأ في استعادة كلمة السر');
                }
                return response.json();
            })
            .then(data => {
                submitError.style.color = "green";
                submitError.style.display = "block";
                submitError.innerHTML = "تم إرسال رابط استعادة كلمة السر إلى بريدك الإلكتروني";
                setTimeout(() => { submitError.style.display = "none"; submitError.style.color = "red"; }, 4000);
            })
            .catch(error => {
                submitError.style.color = "red";
                submitError.style.display = "block";
                submitError.innerHTML = "حدث خطأ أثناء محاولة استعادة كلمة السر";
                setTimeout(() => { submitError.style.display = "none"; }, 3000);
                console.error('Error:', error);
            });

            return false;
        }