// ==========================================
// ОТЛАДОЧНАЯ ВЕРСИЯ КНОПКИ PWA
// ==========================================

console.log('[DEBUG] Скрипт начал выполняться');

let deferredPrompt;

// 1. Создаем кнопку
const installBtn = document.createElement('button');
installBtn.id = 'universal-install-btn';
installBtn.innerHTML = '📲 Установить приложение';
installBtn.style.cssText = `
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    background: #2563eb !important;
    color: white !important;
    border: none !important;
    padding: 12px 24px !important;
    border-radius: 50px !important;
    font-size: 16px !important;
    font-weight: bold !important;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4) !important;
    z-index: 999999 !important;
    cursor: pointer !important;
    display: block !important; /* ПРИНУДИТЕЛЬНО ПОКАЗЫВАЕМ */
`;
document.body.appendChild(installBtn);

console.log('[DEBUG] Кнопка создана и добавлена в DOM');

// 2. Проверка iOS
function isIOS() {
    const result = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    console.log('[DEBUG] isIOS:', result, 'UserAgent:', navigator.userAgent);
    return result;
}

// 3. Логика
if (isIOS()) {
    console.log('[DEBUG] Это iOS, показываем инструкцию');
    installBtn.innerHTML = '📲 Добавить на экран «Домой»';
    
    installBtn.addEventListener('click', () => {
        alert('Инструкция для iPhone/iPad:\n\n1. Нажмите кнопку "Поделиться" (квадрат со стрелкой вверх) внизу экрана.\n2. Выберите в меню пункт "На экран «Домой»".');
    });
} else {
    console.log('[DEBUG] Это не iOS, ждем beforeinstallprompt');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[DEBUG] beforeinstallprompt сработал!');
        e.preventDefault();
        deferredPrompt = e;
    });

    installBtn.addEventListener('click', async () => {
        console.log('[DEBUG] Клик по кнопке, deferredPrompt:', !!deferredPrompt);
        
        if (!deferredPrompt) {
            alert('Браузер еще не готов к установке. Подождите несколько секунд и попробуйте снова.');
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[DEBUG] Результат:', outcome);
        
        if (outcome === 'accepted') {
            installBtn.style.display = 'none';
        }
        deferredPrompt = null;
    });
}

// 4. После установки
window.addEventListener('appinstalled', () => {
    console.log('[DEBUG] Приложение установлено');
    installBtn.style.display = 'none';
    deferredPrompt = null;
});

// 5. Регистрация SW
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/my-portfolio-card/sw.js')
            .then(registration => console.log('[SW] OK:', registration.scope))
            .catch(error => console.log('[SW] Error:', error));
    });
}

console.log('[DEBUG] Скрипт полностью загружен');