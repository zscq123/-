// ==========================================
// Service Worker - 离线支持
// ==========================================

const CACHE_NAME = 'wucuotuo-v1.0.2';
const OFFLINE_URL = '/offline.html';

// 需要缓存的文件
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/base.css',
  '/css/mobile.css',
  '/css/dark.css',
  '/css/animations.css',
  '/js/storage.js',
  '/js/task.js',
  '/js/pomodoro.js',
  '/js/swipe.js',
  '/js/app.js',
  '/manifest.json'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ 缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('❌ 缓存失败:', error);
      })
  );
  // 强制激活新的 Service Worker
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 立即控制所有页面
  self.clients.claim();
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有，返回缓存
        if (response) {
          return response;
        }

        // 否则发起网络请求
        return fetch(event.request)
          .then((response) => {
            // 检查是否是有效响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应
            const responseToCache = response.clone();

            // 将响应添加到缓存
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // 网络请求失败，返回离线页面
            return caches.match(OFFLINE_URL);
          });
      })
  );
});

// 处理消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 后台同步（未来功能）
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

async function syncTasks() {
  // 同步任务数据到服务器
  console.log('📡 后台同步任务...');
}

// 推送通知（未来功能）
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '您有新的任务提醒',
    icon: 'assets/icons/icon-192.png',
    badge: 'assets/icons/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'task-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('勿蹉跎', options)
  );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
