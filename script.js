// ==========================================
// УНИВЕРСАЛЬНАЯ ЛОГИКА УСТАНОВКИ PWA
// ==========================================

let deferredPrompt;

// 1. Создаем универсальную кнопку установки (плавающую, поверх всего)
const installBtn = document.createElement('button');
installBtn.id = 'universal-install-btn';
installBtn.innerHTML = '📲 Установить приложение';
installBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #2563eb;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
    z-index: 10000;
    cursor: pointer;
    transition: transform 0.2s;
    display: none; /* Скрыта по умолчанию */
`;
document.body.appendChild(installBtn);

installBtn.addEventListener('mouseover', () => { installBtn.style.transform = 'scale(1.05)'; });
installBtn.addEventListener('mouseout', () => { installBtn.style.transform = 'scale(1)'; });

// 2. Определяем платформу
function isIOS() {
    return [
        'iPad Simulator', 'iPhone Simulator', 'iPod Simulator',
        'iPad', 'iPhone', 'iPod'
    ].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

// 3. Логика для iOS (Safari)
if (isIOS()) {
    // В iOS нет события beforeinstallprompt, показываем инструкцию сразу
    installBtn.style.display = 'block';
    installBtn.innerHTML = '📲 Добавить на экран «Домой»';
    
    installBtn.addEventListener('click', () => {
        alert('Чтобы установить приложение:\n\n1. Нажмите кнопку "Поделиться" внизу браузера (значок квадрата со стрелкой).\n2. Прокрутите меню вниз и выберите "На экран «Домой»".');
    });
} 
// 4. Логика для Android/Desktop (Chrome, Edge, Samsung Internet и др.)
else {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Показываем кнопку только если браузер поддерживает установку
        installBtn.style.display = 'block';
        console.log('[PWA] Кнопка установки активирована');
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
            // Если событие не сработало (например, Firefox или старый браузер), даем инструкцию
            alert('Ваш браузер может не поддерживать автоматическую установку. Попробуйте найти пункт "Установить приложение" в меню браузера.');
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] Пользователь выбрал: ${outcome}`);
        
        if (outcome === 'accepted') {
            installBtn.style.display = 'none';
        }
        deferredPrompt = null;
    });
}

// 5. Скрываем кнопку после успешной установки (для всех ОС)
window.addEventListener('appinstalled', () => {
    console.log('[PWA] Приложение успешно установлено');
    installBtn.style.display = 'none';
    deferredPrompt = null;
});

// 6. Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/my-portfolio-card/sw.js')
            .then(registration => {
                console.log('[SW] Успешно зарегистрирован:', registration.scope);
            })
            .catch(error => {
                console.log('[SW] Ошибка регистрации:', error);
            });
    });
}