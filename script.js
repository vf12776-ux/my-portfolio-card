// ==========================================
// УНИВЕРСАЛЬНАЯ КНОПКА PWA (ГАРАНТИРОВАННЫЙ ПОКАЗ)
// ==========================================

let deferredPrompt;

// 1. Создаем кнопку
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
    transition: all 0.3s ease;
    display: none; /* Скрыта, пока не определим устройство */
`;
document.body.appendChild(installBtn);

// 2. Функция определения iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// 3. Логика отображения и работы
if (isIOS()) {
    // Для iOS показываем кнопку сразу
    installBtn.style.display = 'block';
    installBtn.innerHTML = '📲 Добавить на экран «Домой»';
    
    installBtn.addEventListener('click', () => {
        alert('Инструкция для iPhone/iPad:\n\n1. Нажмите кнопку "Поделиться" (квадрат со стрелкой вверх) внизу экрана.\n2. Выберите в меню пункт "На экран «Домой»".');
    });
} else {
    // Для Android/Desktop ждем события установки
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'block'; // Показываем кнопку только когда браузер готов
        console.log('[PWA] Браузер готов к установке');
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
            // Если событие еще не пришло, пробуем подождать или даем подсказку
            alert('Идет подготовка к установке... Пожалуйста, попробуйте через несколько секунд или найдите пункт "Установить" в меню браузера.');
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            installBtn.style.display = 'none';
        }
        deferredPrompt = null;
    });
}

// 4. Скрываем кнопку после установки
window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    deferredPrompt = null;
});

// 5. Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/my-portfolio-card/sw.js')
            .then(registration => console.log('[SW] OK:', registration.scope))
            .catch(error => console.log('[SW] Error:', error));
    });
}