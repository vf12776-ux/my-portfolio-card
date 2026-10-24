// ==========================================
// УМНАЯ КНОПКА УСТАНОВКИ PWA
// ==========================================

let deferredPrompt;

// 1. Создаем кнопку в интерфейсе
const installBtn = document.createElement('button');
installBtn.id = 'smart-install-btn';
installBtn.innerHTML = '📲 Установить приложение';
installBtn.style.cssText = `
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
    color: white !important;
    border: none !important;
    padding: 14px 24px !important;
    border-radius: 50px !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.5) !important;
    z-index: 999999 !important;
    cursor: pointer !important;
    display: block !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
`;
document.body.appendChild(installBtn);

// Эффект при наведении (для десктопа)
installBtn.addEventListener('mouseenter', () => {
    installBtn.style.transform = 'scale(1.05)';
});
installBtn.addEventListener('mouseleave', () => {
    installBtn.style.transform = 'scale(1)';
});

// 2. Определение iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// 3. Логика для iOS
if (isIOS()) {
    installBtn.innerHTML = '📲 Добавить на экран «Домой»';
    
    installBtn.addEventListener('click', () => {
        alert('📱 Инструкция для iPhone/iPad:\n\n1. Нажмите кнопку "Поделиться" (квадрат со стрелкой вверх) внизу экрана Safari.\n2. Прокрутите меню вниз и выберите "На экран «Домой»".\n3. Нажмите "Добавить" в правом верхнем углу.');
    });
} 
// 4. Логика для Android / Desktop (Chrome, Edge, Samsung Internet и др.)
else {
    // Слушаем событие готовности браузера к установке
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Меняем текст кнопки, чтобы показать, что установка готова
        installBtn.innerHTML = '⚡ Установить приложение';
        console.log('[PWA] Браузер готов к нативной установке');
    });

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            // Вариант А: Браузер готов, вызываем нативное окно Chrome
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                installBtn.style.display = 'none'; // Скрываем после успешной установки
            }
            deferredPrompt = null;
        } else {
            // Вариант Б: Браузер еще не готов (первый визит или другой браузер)
            alert('💡 Чтобы установить приложение:\n\n1. Нажмите на меню браузера (три точки ⋮ в правом верхнем углу).\n2. Выберите пункт "Установить приложение" или "Добавить на главный экран".\n\n(Совет: в Chrome кнопка станет активной после 2-3 посещений сайта).');
        }
    });
}

// 5. Скрываем кнопку, если приложение уже установлено
window.addEventListener('appinstalled', () => {
    console.log('[PWA] Приложение успешно установлено');
    installBtn.style.display = 'none';
    deferredPrompt = null;
});

// 6. Регистрация Service Worker (обязательно для PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/my-portfolio-card/sw.js')
            .then(registration => console.log('[SW] Успешно зарегистрирован:', registration.scope))
            .catch(error => console.log('[SW] Ошибка регистрации:', error));
    });
}