// ==========================================
// МОДАЛЬНОЕ ОКНО PWA ДЛЯ ANDROID/CHROME
// ==========================================

let deferredPrompt;

// 1. Создаем модальное окно
const modal = document.createElement('div');
modal.id = 'pwa-modal';
modal.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    z-index: 999999;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
`;

modal.innerHTML = `
    <div style="
        background: white;
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        max-width: 420px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        animation: modalFadeIn 0.3s ease;
    ">
        <div style="font-size: 64px; margin-bottom: 20px;">📱</div>
        <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 24px; font-weight: 700;">
            Установить приложение
        </h2>
        <p style="margin: 0 0 25px 0; color: #666; font-size: 15px; line-height: 1.6;">
            Добавьте визитку на главный экран для быстрого доступа
        </p>
        
        <div id="pwa-install-section" style="display: none;">
            <button id="pwa-install-btn" style="
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                color: white;
                border: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-size: 17px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                margin-bottom: 12px;
                box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
                transition: transform 0.2s;
            ">⚡ Установить</button>
        </div>
        
        <div id="pwa-instruction-section" style="display: none;">
            <div style="
                background: #f8fafc;
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 20px;
                text-align: left;
            ">
                <p style="margin: 0 0 12px 0; color: #333; font-size: 14px; font-weight: 600;">
                    Как установить:
                </p>
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 24px; margin-right: 12px;">⋮</span>
                    <span style="color: #555; font-size: 14px;">Нажмите на три точки в браузере</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 24px; margin-right: 12px;">📲</span>
                    <span style="color: #555; font-size: 14px;">Выберите "Установить приложение"</span>
                </div>
            </div>
            <p style="margin: 0; color: #999; font-size: 12px;">
                Совет: откройте сайт в обычном режиме и посетите 2-3 раза для автоматической установки
            </p>
        </div>
        
        <button id="pwa-close-btn" style="
            background: transparent;
            color: #999;
            border: none;
            padding: 12px;
            font-size: 14px;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
        ">Закрыть</button>
    </div>
`;

document.body.appendChild(modal);

// Добавляем анимацию
const style = document.createElement('style');
style.textContent = `
    @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);

// 2. Определение iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// 3. Логика для iOS
if (isIOS()) {
    modal.querySelector('h2').textContent = 'Добавить на экран «Домой»';
    document.getElementById('pwa-instruction-section').style.display = 'block';
    document.getElementById('pwa-instruction-section').innerHTML = `
        <div style="
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            text-align: left;
        ">
            <p style="margin: 0 0 12px 0; color: #333; font-size: 14px; font-weight: 600;">
                Как установить на iPhone/iPad:
            </p>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 24px; margin-right: 12px;">⎋</span>
                <span style="color: #555; font-size: 14px;">Нажмите "Поделиться"</span>
            </div>
            <div style="display: flex; align-items: center;">
                <span style="font-size: 24px; margin-right: 12px;">🏠</span>
                <span style="color: #555; font-size: 14px;">Выберите "На экран «Домой»"</span>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 2000);
} 
// 4. Логика для Android/Desktop
else {
    // Ждем события установки
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Если событие пришло — показываем кнопку установки
        document.getElementById('pwa-install-section').style.display = 'block';
        document.getElementById('pwa-instruction-section').style.display = 'none';
        
        setTimeout(() => {
            modal.style.display = 'flex';
        }, 2000);
    });

    // Если через 3 секунды событие не пришло — показываем инструкцию
    setTimeout(() => {
        if (!deferredPrompt) {
            document.getElementById('pwa-install-section').style.display = 'none';
            document.getElementById('pwa-instruction-section').style.display = 'block';
            modal.style.display = 'flex';
        }
    }, 3000);

    // Обработчик кнопки установки
    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            modal.style.display = 'none';
        }
        deferredPrompt = null;
    });
}

// 5. Закрытие модального окна
document.getElementById('pwa-close-btn').addEventListener('click', () => {
    modal.style.display = 'none';
});

// 6. После установки
window.addEventListener('appinstalled', () => {
    modal.style.display = 'none';
    deferredPrompt = null;
});

// 7. Регистрация SW
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/my-portfolio-card/sw.js')
            .then(registration => console.log('[SW] OK:', registration.scope))
            .catch(error => console.log('[SW] Error:', error));
    });
}