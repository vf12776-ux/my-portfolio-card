document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Плавный скролл по якорным ссылкам
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // 2. Мобильное меню (бургер)
    // ==========================================
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            if (nav.style.display === 'block') {
                nav.style.display = 'none';
            } else {
                nav.style.display = 'block';
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

    // ==========================================
    // 3. PWA: Регистрация Service Worker
    // ==========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('Service Worker зарегистрирован:', reg.scope))
                .catch(err => console.log('Ошибка регистрации SW:', err));
        });
    }

    // ==========================================
    // 4. CMS: Подгрузка данных из data/site.json
    // ==========================================
    fetch('/data/site.json')
        .then(response => {
            if (!response.ok) throw new Error('Файл данных не найден');
            return response.json();
        })
        .then(data => {
            // Заголовок вкладки браузера
            if (data.name && data.title) {
                document.title = `${data.name} | ${data.title}`;
            }

            // Имя в Hero-секции
            const titleEl = document.querySelector('.hero__title');
            if (titleEl && data.name) {
                titleEl.innerHTML = `Привет, я <span class="highlight">${data.name}</span>`;
            }
            
            // Подзаголовок
            const subtitleEl = document.querySelector('.hero__subtitle');
            if (subtitleEl && data.title && data.description) {
                subtitleEl.textContent = `${data.title}. ${data.description}`;
            }
            
            // Фотография
            const imgEl = document.querySelector('.hero__img');
            if (imgEl && data.photo) {
                imgEl.src = data.photo;
                imgEl.alt = `Фото: ${data.name}`;
            }

            console.log('Данные из админки успешно загружены');
        })
        .catch(err => {
            console.log('Используются стандартные данные из HTML:', err.message);
        });
});