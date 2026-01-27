const scriptURL = 'https://script.google.com/macros/s/AKfycbyY9-7Hr_2siF3o-OEJqOqcT2CjVqfIE2P2xlITJwSI4m5ol8oPGWIi-rixh1VzGj-D/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('courseForm');
    const message = document.getElementById('formMessage');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            // Gathering data
            const formData = new FormData(form);

            // Basic validation
            let isValid = true;
            formData.forEach((value, key) => {
                if (!value && form.elements[key] && form.elements[key].required) {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Iltimos barcha maydonlarni to'ldiring");
                return;
            }

            // Number validation (formerly phone)
            const number = formData.get('number');
            if (number && !/^\+998\d{9}$/.test(number.replace(/\s/g, ''))) {
                alert("Telefon raqam +998 bilan va to‘g‘ri formatda bo‘lsin");
                return;
            }

            // Update UI to loading state
            btn.disabled = true;
            btn.textContent = "YUBORILMOQDA...";

            // Convert to URLSearchParams for POST
            const data = new URLSearchParams(formData);

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors', // Apps Script requires no-cors for simple POST
                body: data
            })
                .then(() => {
                    if (message) {
                        message.textContent = "Muvaffaqiyatli yuborildi! ✅";
                        message.style.color = "white";
                    }
                    form.reset();

                    // Reset selects if any
                    form.querySelectorAll('select').forEach(select => {
                        select.selectedIndex = 0;
                    });

                    btn.textContent = "YUBORILDI";
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.textContent = originalText;
                        if (message) message.textContent = "";
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (message) {
                        message.textContent = "Xatolik yuz berdi. Qayta urinib ko'ring.";
                        message.style.color = "#ffcccc";
                    }
                    btn.disabled = false;
                    btn.textContent = originalText;
                });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
