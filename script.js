// ==========================================
// PWA: МОДАЛЬНОЕ ОКНО УСТАНОВКИ
// ==========================================

let deferredPrompt;

// 1. Создание модального окна (динамически, не нужно править HTML)
const modal = document.createElement('div');
modal.id = 'pwa-install-modal';
modal.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99999;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
`;

modal.innerHTML = `
    <div style="
        background: white;
        padding: 30px;
        border-radius: 16px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    ">
        <div style="font-size: 48px; margin-bottom: 15px;">📱</div>
        <h2 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 22px;">Установить приложение</h2>
        <p style="margin: 0 0 25px 0; color: #666; font-size: 15px; line-height: 1.5;">
            Добавьте визитку на главный экран для быстрого доступа
        </p>
        <button id="pwa-install-btn" style="
            background: #2563eb;
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-bottom: 10px;
            transition: background 0.2s;
        ">Установить</button>
        <button id="pwa-close-btn" style="
            background: transparent;
            color: #999;
            border: none;
            padding: 10px;
            font-size: 14px;
            cursor: pointer;
            width: 100%;
        ">Позже</button>
    </div>
`;

document.body.appendChild(modal);

// 2. Определение iOS
function isIOS() {
    return [
        'iPad Simulator', 'iPhone Simulator', 'iPod Simulator',
        'iPad', 'iPhone', 'iPod'
    ].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

// 3. Для iOS — показываем инструкцию
if (isIOS()) {
    const iosHint = document.createElement('div');
    iosHint.style.cssText = `
        display: none;
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        font-size: 14px;
        z-index: 10000;
        text-align: center;
        max-width: 90%;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
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

// 4. Для Android/Desktop — перехватываем событие установки
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Показываем модальное окно через 3 секунды после загрузки
    setTimeout(() => {
        modal.style.display = 'flex';
        console.log('[PWA] Модальное окно показано');
    }, 3000);
});

// 5. Обработчики кнопок модального окна
const installBtn = document.getElementById('pwa-install-btn');
const closeBtn = document.getElementById('pwa-close-btn');

installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Пользователь выбрал: ${outcome}`);
    
    modal.style.display = 'none';
    deferredPrompt = null;
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 6. Скрыть модальное окно после успешной установки
window.addEventListener('appinstalled', () => {
    console.log('[PWA] Приложение установлено');
    modal.style.display = 'none';
    deferredPrompt = null;
});

// 7. Регистрация Service Worker
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