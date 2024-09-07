import * as flsFunctions from "./modules/functions.js";

flsFunctions.isWebp();

import Swiper, { Navigation, Pagination } from "swiper";

const swiper = new Swiper();

/** Start Menu */
// Открытие меню
document.querySelector('.header__menu-button').addEventListener('click', function() {
    document.querySelector('.header__nav').classList.add('header__nav_active');
});

// Закрытие меню
document.querySelector('.header__close-button').addEventListener('click', function() {
    document.querySelector('.header__nav').classList.remove('header__nav_active');
});

// Обрабатываем клики по ссылкам меню
document.querySelectorAll('.header__menu-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Отменяем стандартное поведение ссылки

        // Плавная прокрутка к соответствующему якорю
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({
            behavior: 'smooth' // Плавная прокрутка
        });

        // Закрытие меню после нажатия
        document.querySelector('.header__nav').classList.remove('header__nav_active');
    });
});

/** Start Quiz */
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const openModalBtns = document.querySelectorAll('.open-quiz');  // Все кнопки открытия модального окна
    const carTypeButtons = document.querySelectorAll('.hero__icon-item');  // Кнопки с типами авто
    const closeModalBtn = document.querySelector('.modal__close');
    const nextButtons = document.querySelectorAll('.quiz__next-button');
    const steps = document.querySelectorAll('.quiz__step');
    const progressBarFill = document.querySelector('.progress-bar__fill');
    const modalContent = document.querySelector('.modal__content');
    const totalSteps = steps.length;
    let currentStep = 0;
    let selectedCarType = null;  // Для хранения выбранного типа авто

    // Функция для сброса всех шагов и возвращения к первому шагу
    function resetSteps() {
        steps.forEach(step => step.style.display = 'none');
        currentStep = 0;
    }

    // Открытие модального окна без предустановленного типа авто (для всех кнопок с классом open-modal)
    openModalBtns.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            selectedCarType = null;  // Сбрасываем выбор типа авто
            resetSteps();  // Сброс всех шагов
            modal.style.display = 'block';
            steps[0].style.display = 'block';  // Отображаем первый шаг
            currentStep = 0;
            updateProgressBar();
        });
    });

    // Открытие модального окна с предустановленным типом авто
    carTypeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            selectedCarType = this.getAttribute('data-car-type');  // Получаем выбранный тип авто
            resetSteps();  // Сброс всех шагов
            modal.style.display = 'block';
            currentStep = 1;  // Пропускаем первый шаг
            steps[currentStep].style.display = 'block';  // Показываем второй шаг
            updateProgressBar();
        });
    });

    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    nextButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (validateStep(currentStep)) {
                steps[currentStep].style.display = 'none';
                currentStep++;
                if (currentStep < steps.length) {
                    steps[currentStep].style.display = 'block';
                    updateProgressBar();
                } else {
                    completeProgressBar();
                    showThankYouMessage();
                }
            }
        });
    });

    function validateStep(step) {
        if (step === 0 && selectedCarType) {
            return true;  // Пропускаем шаг валидации, если тип авто уже выбран
        }

        const currentStepInputs = steps[step].querySelectorAll('input[type="radio"]:checked, input[type="number"], input[type="text"], input[type="tel"], select');
        let isValid = false;

        currentStepInputs.forEach(input => {
            if (input.type === "select-one") {
                if (input.value !== "") {
                    isValid = true;
                }
            } else if (input.checked || input.value.trim() !== "") {
                isValid = true;
            }
        });

        if (!isValid) {
            alert('Будь ласка, оберіть варіант або введіть дані.');
            return false;
        }
        return true;
    }

    function updateProgressBar() {
        let progress;
    
        if (currentStep === 0) {
            progress = 0;
        } else {
            if (currentStep < totalSteps - 1) {
                const baseProgress = 20;
                const stepProgress = ((currentStep - 1) / (totalSteps - 2)) * 60;
                progress = baseProgress + stepProgress;
            } else if (currentStep === totalSteps - 1) {
                progress = 80;
            }
        }
    
        progressBarFill.style.width = `${progress}%`;
    }

    function completeProgressBar() {
        progressBarFill.style.width = '100%';
    }

    function showThankYouMessage() {
        modalContent.innerHTML = `
            <div class="progress-bar">
                <div class="progress-bar__fill" style="width: 100%;"></div>
            </div>
            <h2>Дякуємо за заявку!</h2>
            <p>Наш менеджер зв’яжеться з Вами у робочий час протягом 15 хвилин.</p>
            <button class="modal__close">&times;</button>
        `;

        const newCloseButton = document.querySelector('.modal__close');
        newCloseButton.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    // Закрытие окна при клике вне его контента без сброса
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

/** Start Counter */
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.counter__number');

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;

                const speed = 300;
                const increment = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
        });
    };

    const onScroll = () => {
        const counterSection = document.querySelector('.counter');
        const counterTop = counterSection.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight - counterSection.offsetHeight / 2;

        if (counterTop < triggerPoint) {
            animateCounters();
            window.removeEventListener('scroll', onScroll);
        }
    };

    window.addEventListener('scroll', onScroll);
});

/** Start Owl Carousel */
$(document).ready(function(){
    $(".testimonials__carousel").owlCarousel({
        items: 3,
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        autoplay: false, 
        autoplayTimeout: 5000,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });
  
    $('.testimonials__prev').click(function() {
        $(".testimonials__carousel").trigger('prev.owl.carousel');
    });
  
    $('.testimonials__next').click(function() {
        $(".testimonials__carousel").trigger('next.owl.carousel');
    });
});

/** Start FAQ */
document.querySelectorAll('.faq__question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const answer = faqItem.querySelector('.faq__answer');
        const icon = button.querySelector('.faq__icon');
        const isActive = faqItem.classList.contains('active');

        document.querySelectorAll('.faq__item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq__icon').textContent = '+';
            item.querySelector('.faq__answer').style.maxHeight = null;
            item.querySelector('.faq__answer').style.padding = "0 20px";
        });

        if (!isActive) {
            faqItem.classList.add('active');
            icon.textContent = '-';

            answer.style.maxHeight = "50vh";
            answer.style.padding = "20px";
        }
    });
});

/** Start popup */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.open-popup').forEach(button => {
        button.addEventListener('click', function () {
            const formId = this.getAttribute('data-form');
            document.getElementById(formId).style.display = 'flex';
        });
    });

    document.querySelectorAll('.popup-form__close').forEach(closeButton => {
        closeButton.addEventListener('click', function () {
            this.closest('.popup-form').style.display = 'none';
        });
    });

    window.addEventListener('click', function (e) {
        document.querySelectorAll('.popup-form').forEach(popup => {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    });
});

/** Start Card Slider */
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.available-cars__slider');

    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.available-cars__image');
        const prevButton = slider.querySelector('.available-cars__slider-prev');
        const nextButton = slider.querySelector('.available-cars__slider-next');
        const dotsContainer = slider.querySelector('.available-cars__dots');

        let currentIndex = 0;
        const totalImages = images.length;

        if (totalImages <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            dotsContainer.style.display = 'none';
        } else {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalImages; i++) {
                const dot = document.createElement('span');
                dot.classList.add('available-cars__dot');
                if (i === currentIndex) {
                    dot.classList.add('available-cars__dot--active');
                }
                dotsContainer.appendChild(dot);

                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider(currentIndex);
                });
            }
        }

        function updateSlider(index) {
            images.forEach((image, i) => {
                image.classList.remove('available-cars__image--active');
                dotsContainer.children[i].classList.remove('available-cars__dot--active');
                if (i === index) {
                    image.classList.add('available-cars__image--active');
                    dotsContainer.children[i].classList.add('available-cars__dot--active');
                }
            });
        }

        prevButton.addEventListener('click', function() {
            currentIndex = (currentIndex === 0) ? totalImages - 1 : currentIndex - 1;
            updateSlider(currentIndex);
        });

        nextButton.addEventListener('click', function() {
            currentIndex = (currentIndex === totalImages - 1) ? 0 : currentIndex + 1;
            updateSlider(currentIndex);
        });
    });
});

/** Start Scroll Top */
const scrollToTopBtn = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) { // Порог показа кнопки
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/** Start Fixed Header */
window.addEventListener('scroll', function() {
    var header = document.querySelector('.header');
    var scrollTop = window.scrollY;

    if (scrollTop > 100) {
        header.classList.add('fixed');
    } else {
        header.classList.remove('fixed');
    }
});

/** Start Animation */
document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('.animate'); // Находим все элементы с классом "animate"

    const options = {
        root: null, // viewport
        threshold: 0.1 // элемент виден на 10%
    };

    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('zoom-in'); // Добавляем класс для анимации
                observer.unobserve(entry.target); // Прекращаем наблюдение после первого срабатывания
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    animatedElements.forEach(element => {
        observer.observe(element); // Наблюдаем за каждым элементом с классом "animate"
    });
});
