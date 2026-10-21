// --- Логика PWA Installation ---
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
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
  // Предотвращаем стандартное мини-инфо браузера
  e.preventDefault();
  // Сохраняем событие для последующего вызова
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
    // ВАЖНО: Относительный путь ./sw.js для работы в подпапке GitHub Pages
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('[SW] Зарегистрирован успешно:', registration.scope);
      })
      .catch(error => {
        console.log('[SW] Ошибка регистрации:', error);
      });
  });
}

// --- Загрузка данных из data/site.json (если нужно) ---
// Пример загрузки, если ты используешь dynamic content
/*
fetch('./data/site.json')
  .then(response => response.json())
  .then(data => {
    console.log('Данные сайта загружены:', data);
    // Здесь код для подстановки данных в HTML
  })
  .catch(error => console.error('Ошибка загрузки JSON:', error));
*/