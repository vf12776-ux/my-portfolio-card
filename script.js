document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Плавный скролл
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 2. Мобильное меню
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.style.display = (nav.style.display === 'block') ? 'none' : 'block';
            if (nav.style.display === 'block') {
                nav.style.position = 'absolute';
                nav.style.top = '70px';
                nav.style.left = '0';
                nav.style.width = '100%';
                nav.style.background = 'white';
                nav.style.padding = '20px';
                nav.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
                nav.style.zIndex = '999';
            }
        });
    }

    // 3. PWA: Регистрация Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW зарегистрирован:', reg.scope))
                .catch(err => console.log('Ошибка SW:', err));
        });
    }

    // 4. CMS: Подгрузка данных
    fetch('/data/site.json')
        .then(response => response.ok ? response.json() : Promise.reject('Нет данных'))
        .then(data => {
            if (data.name && data.title) document.title = `${data.name} | ${data.title}`;
            const titleEl = document.querySelector('.hero__title');
            if (titleEl && data.name) titleEl.innerHTML = `Привет, я <span class="highlight">${data.name}</span>`;
            const subtitleEl = document.querySelector('.hero__subtitle');
            if (subtitleEl && data.title && data.description) subtitleEl.textContent = `${data.title}. ${data.description}`;
            const imgEl = document.querySelector('.hero__img');
            if (imgEl && data.photo) { imgEl.src = data.photo; imgEl.alt = `Фото: ${data.name}`; }
        })
        .catch(() => console.log('Используются стандартные данные из HTML'));


    // ==========================================
    // 5. PWA: УМНАЯ КНОПКА УСТАНОВКИ
    // ==========================================
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');
    const iosHint = document.getElementById('ios-hint');

    // Проверка на iOS
    const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent);
    };

    // А. Если браузер поддерживает программную установку (Android, Chrome Desktop)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // Отменяем стандартный мини-баннер браузера
        deferredPrompt = e; // Сохраняем событие
        if (installBtn) installBtn.style.display = 'block'; // Показываем нашу кнопку
    });

    // Б. Обработка нажатия на кнопку "Установить"
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt(); // Показываем нативное окно установки
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('Пользователь установил приложение');
            }
            deferredPrompt = null;
            installBtn.style.display = 'none'; // Скрываем кнопку после попытки
        });
    }

    // В. Событие успешной установки (срабатывает во всех поддерживаемых браузерах)
    window.addEventListener('appinstalled', () => {
        console.log('PWA успешно установлено!');
        if (installBtn) installBtn.style.display = 'none';
        if (iosHint) iosHint.style.display = 'none';
        deferredPrompt = null;
    });

    // Г. Фоллбэк для iOS: показываем подсказку, если это iOS и приложение еще НЕ установлено
    if (isIos() && !window.navigator.standalone) {
        if (iosHint) iosHint.style.display = 'block';
    }
});