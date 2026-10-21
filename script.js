// --- Логика PWA Installation ---
let deferredPrompt;
// ВАЖНО: ID должен совпадать с HTML (install-btn через дефис)
const installBtn = document.getElementById('install-btn');
const iosHint = document.getElementById('ios-hint');

// Проверка на iOS для показа подсказки
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

if (isIos()) {
  if (iosHint) iosHint.style.display = 'block';
}

// Обработка события beforeinstallprompt (Android/Desktop Chrome)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Показываем нашу кастомную кнопку
  if (installBtn) {
    installBtn.style.display = 'block';
    console.log('[PWA] Кнопка установки показана');
  }
});

// Обработчик клика по кнопке установки
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    // Показываем нативное модальное окно установки
    deferredPrompt.prompt();
    
    // Ждем выбора пользователя
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Пользователь ${outcome}`);
    
    // Скрываем кнопку после попытки установки
    installBtn.style.display = 'none';
    deferredPrompt = null;
  });
}

// Скрытие кнопки, если приложение уже установлено
window.addEventListener('appinstalled', () => {
  if (installBtn) installBtn.style.display = 'none';
  deferredPrompt = null;
});

// --- Регистрация Service Worker ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('[SW] Зарегистрирован успешно:', registration.scope);
      })
      .catch(error => {
        console.log('[SW] Ошибка регистрации:', error);
      });
  });
}