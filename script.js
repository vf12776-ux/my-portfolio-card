// --- Логика PWA Installation ---
let deferredPrompt;
const installBtn = document.getElementById('install-btn');
const iosHint = document.getElementById('ios-hint');

const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

if (isIos()) {
  if (iosHint) iosHint.style.display = 'block';
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.style.display = 'block';
    console.log('[PWA] Кнопка установки показана');
    updateDebug('PWA PROMPT СРАБОТАЛ!');
  }
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Пользователь ${outcome}`);
    installBtn.style.display = 'none';
    deferredPrompt = null;
  });
}

window.addEventListener('appinstalled', () => {
  if (installBtn) installBtn.style.display = 'none';
  deferredPrompt = null;
});

// --- Регистрация Service Worker ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/my-portfolio-card/sw.js')
      .then(registration => {
        console.log('[SW] Зарегистрирован успешно:', registration.scope);
        updateDebug('SW OK: ' + registration.scope);
      })
      .catch(error => {
        console.log('[SW] Ошибка регистрации:', error);
        updateDebug('SW ОШИБКА: ' + error);
      });
  });
}

window.addEventListener('load', () => {
  updateDebug('Страница загружена. Ждем PWA...');
});

// --- PWA: Инструкция только для iOS ---
function isIOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

if (isIOS()) {
    // Создаем простую подсказку для iOS
    const iosHint = document.createElement('div');
    iosHint.id = 'ios-pwa-hint';
    iosHint.style.cssText = `
        display: none;
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        text-align: center;
        max-width: 90%;
    `;
    iosHint.innerHTML = 'Чтобы установить приложение: нажмите <b>Поделиться</b> <span style="font-size:18px">⎋</span> и выберите <b>На экран «Домой»</b>';
    document.body.appendChild(iosHint);

    // Показываем подсказку через 2 секунды после загрузки
    setTimeout(() => {
        iosHint.style.display = 'block';
    }, 2000);

    // Скрываем при клике
    iosHint.addEventListener('click', () => {
        iosHint.style.display = 'none';
    });
}