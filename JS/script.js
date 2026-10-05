function showToast(message, type) {
    var existingToast = document.getElementById('site-toast');
    if (!existingToast) {
        existingToast = document.createElement('div');
        existingToast.id = 'site-toast';
        existingToast.className = 'toast';
        document.body.appendChild(existingToast);
    }

    existingToast.textContent = message;
    existingToast.className = 'toast show ' + (type === 'error' ? 'error' : 'success');
    clearTimeout(existingToast.timeoutId);
    existingToast.timeoutId = setTimeout(function () {
        existingToast.classList.remove('show');
    }, 2600);
}

function loadAjaxModal(url) {
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.innerHTML = '<p>جار تحميل المحتوى...</p>';
    document.body.appendChild(backdrop);

    $.ajax({
        url: url,
        dataType: 'html'
    }).done(function (data) {
        backdrop.innerHTML = data;
        var closeButton = backdrop.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', function () { backdrop.remove(); });
        }
        backdrop.addEventListener('click', function (event) {
            if (event.target === backdrop) { backdrop.remove(); }
        });
    }).fail(function () {
        backdrop.remove();
        showToast('تعذر تحميل المحتوى المطلوب.', 'error');
    });
}

$(document).ready(function () {
    $('[data-modal-url]').on('click', function () {
        loadAjaxModal($(this).data('modal-url'));
    });
});

function validateLogin() {
    var email = document.getElementById("login-email");
    var password = document.getElementById("login-password");
    var form = email.form;

    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }

    showToast('هذه معاينة واجهة فقط؛ لا يوجد نظام دخول أو حسابات متصل بخادم.', 'success');
    return false;
}

function validateRegister() {
    var name = document.getElementById("register-name");
    var email = document.getElementById("register-email");
    var password = document.getElementById("register-password");
    var form = name.form;

    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }

    showToast('هذه معاينة واجهة فقط؛ بيانات الحساب لا تُحفظ لعدم وجود خادم خلفي.', 'success');
    return false;
}

function validateContact() {
    var name = document.getElementById('contact-name');
    var email = document.getElementById('contact-email');
    var message = document.getElementById('contact-message');
    var form = name.form;

    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }

    var successMessage = document.getElementById('contact-success');
    if (successMessage) {
        successMessage.textContent = 'تم استلام طلبك في النموذج التجريبي بنجاح. يمكنك أيضاً التواصل معنا مباشرة عبر WhatsApp أو الهاتف.';
    }
    showToast('تم استلام طلبك في النموذج التجريبي بنجاح.', 'success');
    return false;
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('video').forEach(function (video) {
        video.addEventListener('play', function () {
            document.querySelectorAll('video').forEach(function (otherVideo) {
                if (otherVideo !== video) {
                    otherVideo.pause();
                }
            });
        });
    });

    var slider = document.querySelector('.showcase-slider');
    if (slider) {
        var slides = Array.from(slider.querySelectorAll('.showcase-slide'));
        var dotsContainer = slider.querySelector('.showcase-dots');
        var dots = Array.from(slider.querySelectorAll('.showcase-dots button'));
        var prevButton = slider.querySelector('[data-slide="prev"]');
        var nextButton = slider.querySelector('[data-slide="next"]');
        var currentIndex = 0;

        if (dotsContainer && dots.length !== slides.length) {
            dotsContainer.replaceChildren();
            dots = slides.map(function (slide, index) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', 'الشريحة ' + (index + 1));
                dot.setAttribute('aria-pressed', 'false');
                dotsContainer.appendChild(dot);
                return dot;
            });
        }

        function showSlide(index) {
            currentIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === currentIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === currentIndex);
                dot.setAttribute('aria-pressed', String(dotIndex === currentIndex));
            });
        }

        if (slides.length) {
            prevButton && prevButton.addEventListener('click', function () {
                showSlide(currentIndex - 1);
            });
            nextButton && nextButton.addEventListener('click', function () {
                showSlide(currentIndex + 1);
            });
            dots.forEach(function (dot, index) {
                dot.addEventListener('click', function () {
                    showSlide(index);
                });
            });
            window.setInterval(function () {
                showSlide(currentIndex + 1);
            }, 2000);
        }
    }

    var loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            validateLogin();
        });
    }

    var registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            validateRegister();
        });
    }

    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            validateContact();
        });
    }

    var contactModal = document.getElementById('modal');
    var openContactModal = document.getElementById('openModal');
    if (contactModal && openContactModal) {
        var closeContactModal = contactModal.querySelector('.modal-close');
        function hideContactModal() {
            contactModal.hidden = true;
            document.body.style.overflow = '';
            openContactModal.focus();
        }
        openContactModal.addEventListener('click', function () {
            contactModal.hidden = false;
            document.body.style.overflow = 'hidden';
            closeContactModal && closeContactModal.focus();
        });
        closeContactModal && closeContactModal.addEventListener('click', hideContactModal);
        contactModal.addEventListener('click', function (event) {
            if (event.target === contactModal) { hideContactModal(); }
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !contactModal.hidden) { hideContactModal(); }
        });
        if (window.location.hash === '#openModal') {
            openContactModal.click();
        }
    }

    var filterButtons = document.querySelectorAll('[data-filter]');
    var inventoryCards = document.querySelectorAll('.inventory-card');
    var emptyState = document.querySelector('.empty-state');
    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(function (item) { item.classList.remove('is-active'); });
            button.classList.add('is-active');
            var filter = button.getAttribute('data-filter');
            var visibleCards = 0;
            inventoryCards.forEach(function (card) {
                var isVisible = filter === 'all' || card.getAttribute('data-brand') === filter;
                card.hidden = !isVisible;
                if (isVisible) { visibleCards += 1; }
            });
            if (emptyState) { emptyState.hidden = visibleCards !== 0; }
        });
    });
});

