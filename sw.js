'use strict';
var pending = {};

self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('message', function(e){
  if(!e.data || e.data.type !== 'SCHEDULE') return;
  Object.keys(pending).forEach(function(k){ clearTimeout(pending[k]); });
  pending = {};
  (e.data.list || []).forEach(function(r){
    var delay = r.ts - Date.now();
    if(delay < 0 || delay > 7*24*60*60*1000) return;
    pending[r.id] = setTimeout(function(){
      self.registration.showNotification(r.text, {
        body: r.sub,
        icon: 'icon.png',
        badge: 'icon.png',
        tag: r.id,
        renotify: false
      });
      delete pending[r.id];
    }, delay);
  });
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(function(list){
    for(var i=0;i<list.length;i++) if('focus' in list[i]) return list[i].focus();
    if(clients.openWindow) return clients.openWindow('./');
  }));
});
