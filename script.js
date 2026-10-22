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