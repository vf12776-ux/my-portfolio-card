// ==========================================
// ЧИСТЫЙ КОД PWA ДЛЯ MY-PORTFOLIO-CARD
// ==========================================

// 1. Определение iOS для показа инструкции
function isIOS() {
    return [
        'iPad Simulator', 'iPhone Simulator', 'iPod Simulator',
        'iPad', 'iPhone', 'iPod'
    ].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

// 2. Показ инструкции только для iOS (динамическое создание элемента)
if (isIOS()) {
    const iosHint = document.createElement('div');
    iosHint.id = 'ios-pwa-hint';
    iosHint.style.cssText = `
        display: none; position: fixed; bottom: 20px; left: 50%;
        transform: translateX(-50%); background: rgba(0, 0, 0, 0.85);
        color: white; padding: 12px 20px; border-radius: 8px;
        font-size: 14px; z-index: 10000; text-align: center; max-width: 90%;
    `;
    iosHint.innerHTML = 'Чтобы установить: нажмите <b>Поделиться</b> ⎋ и выберите <b>На экран «Домой»</b>';
    document.body.appendChild(iosHint);
    
    setTimeout(() => { 
        iosHint.style.display = 'block'; 
    }, 2000);
    
    iosHint.addEventListener('click', () => { 
        iosHint.style.display = 'none'; 
    });
}

// 3. Обработка события установки (Android/Chrome)
let deferredPrompt; // Объявляем ТОЛЬКО ОДИН РАЗ

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Готов к установке');
    
    // Если у вас есть кнопка с id="install-btn", она появится
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

// 4. Обработчик клика на кнопку установки (если есть)
const installBtn = document.getElementById('install-btn');
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
            console.log('[PWA] Событие установки недоступно');
            return;
        }
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] Пользователь выбрал: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    });
}

// 5. Скрыть кнопку после успешной установки
window.addEventListener('appinstalled', () => {
    console.log('[PWA] Приложение установлено');
    deferredPrompt = null;
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
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