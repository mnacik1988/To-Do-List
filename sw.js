'use strict';
var CACHE = 'vtodo-shell-v94';
var SHELL = ['./index.html', './manifest.json', './icon.png', './icon-maskable.png', './apple-touch-icon.png', './icon-badge.png', './sw.js'];

/* ── Install: кешируем приложение ── */
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(SHELL); })
      .then(function(){ return self.skipWaiting(); })
  );
});

/* ── Activate: удаляем старые кеши ── */
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

/* ── Fetch ── */
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  /* API-запросы к Cloudflare — всегда через сеть */
  if(url.hostname.indexOf('workers.dev') >= 0) return;
  /* Шрифты Google — через сеть, без кеширования */
  if(url.hostname.indexOf('googleapis.com') >= 0 || url.hostname.indexOf('gstatic.com') >= 0) return;

  /* HTML-документ — СЕТЬ В ПРИОРИТЕТЕ (чтобы обновления всегда применялись),
     кеш только когда нет интернета */
  if(e.request.mode === 'navigate' || url.pathname.indexOf('index.html') >= 0){
    e.respondWith(
      fetch(e.request).then(function(response){
        var clone = response.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        return response;
      }).catch(function(){
        return caches.match(e.request).then(function(c){ return c || caches.match('./index.html'); });
      })
    );
    return;
  }

  /* Остальное (иконки, манифест) — кеш сразу, обновление в фоне */
  e.respondWith(
    caches.match(e.request).then(function(cached){
      var networkFetch = fetch(e.request).then(function(response){
        if(response && response.status === 200 && response.type === 'basic'){
          var clone = response.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        return response;
      }).catch(function(){});
      return cached || networkFetch;
    })
  );
});

/* ── Уведомления: планировщик напоминаний ── */
var pending = {};

self.addEventListener('message', function(e){
  if(!e.data || e.data.type !== 'SCHEDULE') return;
  Object.keys(pending).forEach(function(k){ clearTimeout(pending[k]); });
  pending = {};
  (e.data.list || []).forEach(function(r){
    var delay = r.ts - Date.now();
    if(delay < 0 || delay > 7*24*60*60*1000) return;
    pending[r.id] = setTimeout(function(){
      self.registration.showNotification(r.text, {
        // icon: apple-touch-icon.png (галочка на navy) — большая иконка в
        // развёрнутом уведомлении. badge: icon-badge.png — МАЛЕНЬКИЙ значок в
        // статус-баре; Android красит его силуэтом ПО АЛЬФА-КАНАЛУ картинки.
        // icon.png/apple-touch-icon.png непрозрачны целиком (сплошной
        // квадрат-фон) — весь силуэт заливался белым цветом = "белый квадрат"
        // у часов (2026-07-23). icon-badge.png — та же галочка, но БЕЗ фона,
        // с настоящей прозрачностью вокруг, поэтому в статус-баре видна
        // именно форма галочки, а не квадрат.
        body: r.sub,
        icon: 'apple-touch-icon.png',
        badge: 'icon-badge.png',
        tag: r.id,
        renotify: false
      });
      delete pending[r.id];
    }, delay);
  });
});

/* ── Push: показываем уведомление когда приходит push от Cloudflare ── */
self.addEventListener('push', function(e){
  var data = {};
  try { data = e.data.json(); } catch(err) {}
  var n = data.notification || data;
  var title = n.title || 'Напоминание';
  var body  = n.body  || '';
  e.waitUntil(
    self.registration.showNotification(title, {
      // См. комментарий у первого showNotification выше про icon vs badge.
      body: body,
      icon: 'apple-touch-icon.png',
      badge: 'icon-badge.png',
      tag: 'reminder',
      renotify: true
    })
  );
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window'}).then(function(list){
      for(var i=0;i<list.length;i++) if('focus' in list[i]) return list[i].focus();
      if(clients.openWindow) return clients.openWindow('./');
    })
  );
});
