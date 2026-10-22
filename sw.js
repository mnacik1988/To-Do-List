'use strict';
var CACHE_PREFIX = 'vtodo-shell-';
var NAV_TIMEOUT_MS = 4000;
var CACHE = CACHE_PREFIX + 'v1121';
var SHELL = ['./index.html', './manifest.json', './icon.png', './icon-maskable.png', './apple-touch-icon.png', './icon-badge.png', './sw.js'];
/* Р¤РѕРЅРѕРІС‹Рµ РєР°СЂС‚РёРЅРєРё вЂ” РїСЂРёСЏС‚РЅРѕ, РЅРѕ Р±РµР· РЅРёС… РїСЂРёР»РѕР¶РµРЅРёРµ РїРѕР»РЅРѕСЃС‚СЊСЋ СЂР°Р±РѕС‚РѕСЃРїРѕСЃРѕР±РЅРѕ
   (РїРѕРґ РЅРёРјРё Р»РµР¶РёС‚ С†РІРµС‚ --screen). Р”РµСЂР¶РёРј РёС… РћРўР”Р•Р›Р¬РќРћ РѕС‚ SHELL СЃРѕР·РЅР°С‚РµР»СЊРЅРѕ:
   addAll СЂР°Р±РѕС‚Р°РµС‚ РїРѕ РїСЂРёРЅС†РёРїСѓ В«РІСЃС‘ РёР»Рё РЅРёС‡РµРіРѕВ», Рё РѕРґРёРЅ РЅРµСѓРґР°С‡РЅС‹Р№ С„Р°Р№Р» СЃРѕСЂРІР°Р»
   Р±С‹ СѓСЃС‚Р°РЅРѕРІРєСѓ С†РµР»РёРєРѕРј вЂ” С‚Рѕ РµСЃС‚СЊ РѕС‚РІР°Р»РёР»СЃСЏ Р±С‹ РћР¤Р›РђР™Рќ Сѓ РІСЃРµС…. РљРµС€РёСЂСѓРµРј РєР°Р¶РґСѓСЋ
   РїРѕ РѕС‚РґРµР»СЊРЅРѕСЃС‚Рё Рё РјРѕР»С‡Р° РїСЂРѕС‰Р°РµРј РЅРµСѓРґР°С‡Сѓ. */
var OPTIONAL = ['./bg-light.webp', './bg-dark.webp', './manrope-cyrillic.woff2', './manrope-latin-ext.woff2', './manrope-latin.woff2'];

/* в”Ђв”Ђ Install: РєРµС€РёСЂСѓРµРј РїСЂРёР»РѕР¶РµРЅРёРµ в”Ђв”Ђ */
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){
        return c.addAll(SHELL).then(function(){
          return Promise.all(OPTIONAL.map(function(u){ return c.add(u).catch(function(){}); }));
        });
      })
      .then(function(){ return self.skipWaiting(); })
  );
});

/* в”Ђв”Ђ Activate: СѓРґР°Р»СЏРµРј СЃС‚Р°СЂС‹Рµ РєРµС€Рё в”Ђв”Ђ */
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      // Р§РёСЃС‚РёРј РўРћР›Р¬РљРћ СЃРІРѕРё СЃС‚Р°СЂС‹Рµ РєРµС€Рё. Cache Storage РѕР±С‰РёР№ РЅР° РІРµСЃСЊ origin, Р°
      // РЅР° mnacik1988.github.io Р¶РёРІСѓС‚ Рё РґСЂСѓРіРёРµ РїСЂРёР»РѕР¶РµРЅРёСЏ (NeedBuy, InveStory
      // Рё РїСЂРѕС‡РёРµ) вЂ” СЂР°РЅСЊС€Рµ РѕС‚СЃСЋРґР° СЃРЅРѕСЃРёР»РёСЃСЊ Рё РѕРЅРё, С‚Рѕ РµСЃС‚СЊ РѕР±РЅРѕРІР»РµРЅРёРµ Mynado
      // РѕС‚Р±РёСЂР°Р»Рѕ РѕС„Р»Р°Р№РЅ Сѓ СЃРѕСЃРµРґРµР№ (Р°СѓРґРёС‚ 2026-09-22; РїРѕРґС‚РІРµСЂР¶РґРµРЅРѕ: Сѓ NeedBuy
      // СЃРІРѕР№ РєРµС€ needbuy-*, Сѓ InveStory kapital-*).
      // вљ пёЏ РЈ NeedBuy РІ sw.js СЃС‚РѕРёС‚ СЂРѕРІРЅРѕ С‚Р°РєР°СЏ Р¶Рµ РЅРµСЂР°Р·Р±РѕСЂС‡РёРІР°СЏ С‡РёСЃС‚РєР° вЂ” РѕРЅР°
      // СЃРЅРѕСЃРёС‚ РќРђРЁ РєРµС€. Р§РёРЅРёС‚СЊ С‚Р°Рј РѕС‚РґРµР»СЊРЅРѕ, Р·РґРµСЃСЊ СЌС‚Рѕ РЅРµРґРѕСЃС‚РёР¶РёРјРѕ.
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE && k.indexOf(CACHE_PREFIX) === 0; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

/* в”Ђв”Ђ Fetch в”Ђв”Ђ */
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  /* API-Р·Р°РїСЂРѕСЃС‹ Рє Cloudflare вЂ” РІСЃРµРіРґР° С‡РµСЂРµР· СЃРµС‚СЊ */
  if(url.hostname.indexOf('workers.dev') >= 0) return;
  /* РЁСЂРёС„С‚С‹ Google вЂ” С‡РµСЂРµР· СЃРµС‚СЊ, Р±РµР· РєРµС€РёСЂРѕРІР°РЅРёСЏ */
  if(url.hostname.indexOf('googleapis.com') >= 0 || url.hostname.indexOf('gstatic.com') >= 0) return;

  /* HTML-РґРѕРєСѓРјРµРЅС‚ вЂ” РЎР•РўР¬ Р’ РџР РРћР РРўР•РўР• (С‡С‚РѕР±С‹ РѕР±РЅРѕРІР»РµРЅРёСЏ РІСЃРµРіРґР° РїСЂРёРјРµРЅСЏР»РёСЃСЊ),
     РєРµС€ С‚РѕР»СЊРєРѕ РєРѕРіРґР° РЅРµС‚ РёРЅС‚РµСЂРЅРµС‚Р° */
  if(e.request.mode === 'navigate' || url.pathname.indexOf('index.html') >= 0){
    // РЎРµС‚СЊ РІ РїСЂРёРѕСЂРёС‚РµС‚Рµ, РЅРѕ РќР• РґРѕР»СЊС€Рµ NAV_TIMEOUT_MS: РЅР° СЃР»Р°Р±РѕР№ СЃРІСЏР·Рё СЃС‚СЂР°РЅРёС†Р° СЂР°РЅСЊС€Рµ РІРёСЃРµР»Р° РїСѓСЃС‚РѕР№,
    // РїРѕРєР° СЃРµС‚СЊ РЅРµ РѕС‚РІРµС‚РёС‚ РёР»Рё РЅРµ РѕР±РѕСЂРІС‘С‚СЃСЏ (Р¶Р°Р»РѕР±Р° С‚РµСЃС‚РёСЂРѕРІС‰РёРєР° СЃ Pixel вЂ” РїСѓСЃС‚РѕР№ С‚С‘РјРЅС‹Р№ СЌРєСЂР°РЅ).
    // РџРѕ С‚Р°Р№РјР°СѓС‚Сѓ РѕС‚РґР°С‘Рј РєРѕРїРёСЋ РёР· РєРµС€Р° (РµСЃР»Рё РѕРЅР° РµСЃС‚СЊ), Р° СЃРµС‚СЊ РґРѕР·Р°РіСЂСѓР¶Р°РµС‚СЃСЏ Рё РѕР±РЅРѕРІР»СЏРµС‚ РєРµС€.
    e.respondWith(new Promise(function(resolve){
      var settled = false;
      function cachedPage(){ return caches.match(e.request).then(function(c){ return c || caches.match('./index.html'); }); }
      var timer = setTimeout(function(){
        cachedPage().then(function(c){ if(c && !settled){ settled = true; resolve(c); } });
      }, NAV_TIMEOUT_MS);
      fetch(e.request).then(function(response){
        clearTimeout(timer);
        if(response && response.ok){
          var clone = response.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        if(!settled){ settled = true; resolve(response); }
      }).catch(function(){
        clearTimeout(timer);
        if(!settled){ cachedPage().then(function(c){ settled = true; resolve(c || Response.error()); }); }
      });
    }));
    return;
  }

  /* РћСЃС‚Р°Р»СЊРЅРѕРµ (РёРєРѕРЅРєРё, РјР°РЅРёС„РµСЃС‚) вЂ” РєРµС€ СЃСЂР°Р·Сѓ, РѕР±РЅРѕРІР»РµРЅРёРµ РІ С„РѕРЅРµ */
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

/* в”Ђв”Ђ РЈРІРµРґРѕРјР»РµРЅРёСЏ: РїР»Р°РЅРёСЂРѕРІС‰РёРє РЅР°РїРѕРјРёРЅР°РЅРёР№ в”Ђв”Ђ */
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
        // icon: apple-touch-icon.png (РіР°Р»РѕС‡РєР° РЅР° navy) вЂ” Р±РѕР»СЊС€Р°СЏ РёРєРѕРЅРєР° РІ
        // СЂР°Р·РІС‘СЂРЅСѓС‚РѕРј СѓРІРµРґРѕРјР»РµРЅРёРё. badge: icon-badge.png вЂ” РњРђР›Р•РќР¬РљРР™ Р·РЅР°С‡РѕРє РІ
        // СЃС‚Р°С‚СѓСЃ-Р±Р°СЂРµ; Android РєСЂР°СЃРёС‚ РµРіРѕ СЃРёР»СѓСЌС‚РѕРј РџРћ РђР›Р¬Р¤Рђ-РљРђРќРђР›РЈ РєР°СЂС‚РёРЅРєРё.
        // icon.png/apple-touch-icon.png РЅРµРїСЂРѕР·СЂР°С‡РЅС‹ С†РµР»РёРєРѕРј (СЃРїР»РѕС€РЅРѕР№
        // РєРІР°РґСЂР°С‚-С„РѕРЅ) вЂ” РІРµСЃСЊ СЃРёР»СѓСЌС‚ Р·Р°Р»РёРІР°Р»СЃСЏ Р±РµР»С‹Рј С†РІРµС‚РѕРј = "Р±РµР»С‹Р№ РєРІР°РґСЂР°С‚"
        // Сѓ С‡Р°СЃРѕРІ (2026-07-23). icon-badge.png вЂ” С‚Р° Р¶Рµ РіР°Р»РѕС‡РєР°, РЅРѕ Р‘Р•Р— С„РѕРЅР°,
        // СЃ РЅР°СЃС‚РѕСЏС‰РµР№ РїСЂРѕР·СЂР°С‡РЅРѕСЃС‚СЊСЋ РІРѕРєСЂСѓРі, РїРѕСЌС‚РѕРјСѓ РІ СЃС‚Р°С‚СѓСЃ-Р±Р°СЂРµ РІРёРґРЅР°
        // РёРјРµРЅРЅРѕ С„РѕСЂРјР° РіР°Р»РѕС‡РєРё, Р° РЅРµ РєРІР°РґСЂР°С‚.
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

/* в”Ђв”Ђ Push: РїРѕРєР°Р·С‹РІР°РµРј СѓРІРµРґРѕРјР»РµРЅРёРµ РєРѕРіРґР° РїСЂРёС…РѕРґРёС‚ push РѕС‚ Cloudflare в”Ђв”Ђ */
// РљСЂСѓР¶РѕРє СЃ Р§РРЎР›РћРњ РЅР° РёРєРѕРЅРєРµ РїСЂРёР»РѕР¶РµРЅРёСЏ (Badging API) вЂ” РєР°Рє РІ Telegram.
// РџСѓСЃС‚РѕР№ Р±РµР№РґР¶ Р±РµР· С‡РёСЃР»Р° (v1.80) РЅР° iOS РІС‹РіР»СЏРґРёС‚ РЅРµРІРЅСЏС‚РЅРѕ, РђР»РµРєСЃР°РЅРґСЂ РїРѕРєР°Р·Р°Р»
// СЃРєСЂРёРЅС€РѕС‚РѕРј, С‡С‚Рѕ Р¶РґС‘С‚ РёРјРµРЅРЅРѕ С†РёС„СЂСѓ.
//
// Р§РёСЃР»Рѕ = СЃРєРѕР»СЊРєРѕ РќРђРЁРРҐ СѓРІРµРґРѕРјР»РµРЅРёР№ СЃРµР№С‡Р°СЃ РІРёСЃРёС‚ РІ С€С‚РѕСЂРєРµ. РЎС‡РёС‚Р°РµРј РїРѕ
// getNotifications(), Р° РЅРµ СЃРІРѕРёРј СЃС‡С‘С‚С‡РёРєРѕРј: СЃС‡С‘С‚С‡РёРє РїСЂРёС€Р»РѕСЃСЊ Р±С‹ С…СЂР°РЅРёС‚СЊ РІ
// IndexedDB (localStorage РІ service worker РЅРµС‚) Рё РѕРЅ СЂР°Р·СЉРµР·Р¶Р°Р»СЃСЏ Р±С‹ СЃ
// СЂРµР°Р»СЊРЅРѕСЃС‚СЊСЋ, РєРѕРіРґР° СѓРІРµРґРѕРјР»РµРЅРёСЏ СЃРјР°С…РёРІР°СЋС‚ СЂСѓРєР°РјРё. РЁС‚РѕСЂРєР° вЂ” СЃР°РјР° РїРѕ СЃРµР±Рµ
// РґРѕСЃС‚РѕРІРµСЂРЅС‹Р№ РёСЃС‚РѕС‡РЅРёРє, Рё РІРµРґС‘С‚ СЃРµР±СЏ СЂРѕРІРЅРѕ РєР°Рє РІ РјРµСЃСЃРµРЅРґР¶РµСЂР°С….
//
// Р“РґРµ СЂР°Р±РѕС‚Р°РµС‚: iPhone/iPad СЃ РїСЂРёР»РѕР¶РµРЅРёРµРј РЅР° РґРѕРјР°С€РЅРµРј СЌРєСЂР°РЅРµ (iOS 16.4+, РЅСѓР¶РЅРѕ
// СЂР°Р·СЂРµС€РµРЅРёРµ РЅР° СѓРІРµРґРѕРјР»РµРЅРёСЏ Рё РІРєР»СЋС‡С‘РЅРЅС‹Рµ В«РќР°РєР»РµР№РєРёВ» РІ РЅР°СЃС‚СЂРѕР№РєР°С… iOS) Рё
// СѓСЃС‚Р°РЅРѕРІР»РµРЅРЅС‹Рµ PWA РЅР° РґРµСЃРєС‚РѕРїРµ. РќР° Android Chrome СЌС‚РѕРіРѕ API РќР•Рў вЂ” РЅРѕ С‚Р°Рј РѕРЅ Рё
// РЅРµ РЅСѓР¶РµРЅ: TWA РїРѕРєР°Р·С‹РІР°РµС‚ СѓРІРµРґРѕРјР»РµРЅРёСЏ СЃР°Рј (DelegationService), Рё С‚РѕС‡РєСѓ РЅР°
// РёРєРѕРЅРєРµ СЂРёСЃСѓРµС‚ Р»Р°СѓРЅС‡РµСЂ С€С‚Р°С‚РЅС‹РјРё СЃСЂРµРґСЃС‚РІР°РјРё Android.
//
// РћР±РѕСЂР°С‡РёРІР°РµРј Рё РІ try, Рё РІ .catch: РІ SW СЌС‚Рѕ WorkerNavigator, Рё РЅР° С‡Р°СЃС‚Рё
// РїР»Р°С‚С„РѕСЂРј РјРµС‚РѕРґ РѕР±СЉСЏРІР»РµРЅ, РЅРѕ РєРёРґР°РµС‚ вЂ” СЃРёРЅС…СЂРѕРЅРЅРѕ Р»РёР±Рѕ РѕС‚РєР°Р·РѕРј РїСЂРѕРјРёСЃР°.
function badgeApply(n){
  try{
    if(!self.navigator || !self.navigator.setAppBadge) return Promise.resolve();
    if(n > 0) return Promise.resolve(self.navigator.setAppBadge(n)).catch(function(){});
    if(self.navigator.clearAppBadge) return Promise.resolve(self.navigator.clearAppBadge()).catch(function(){});
  }catch(e){}
  return Promise.resolve();
}
function badgeSync(){
  try{
    return self.registration.getNotifications()
      .then(function(list){ return badgeApply(list.length); })
      .catch(function(){});
  }catch(e){ return Promise.resolve(); }
}

self.addEventListener('push', function(e){
  var data = {};
  try { data = e.data.json(); } catch(err) {}
  var n = data.notification || data;
  // Р—Р°РїР°СЃРЅРѕР№ Р·Р°РіРѕР»РѕРІРѕРє РЅР° СЃР»СѓС‡Р°Р№, РµСЃР»Рё СЃРµСЂРІРµСЂ РЅРµ РїСЂРёСЃР»Р°Р» СЃРІРѕР№. Р Р°РЅСЊС€Рµ С‚СѓС‚ Р±С‹Р»Рѕ
  // СЂСѓСЃСЃРєРѕРµ В«РќР°РїРѕРјРёРЅР°РЅРёРµВ» вЂ” Сѓ РёРЅРѕСЏР·С‹С‡РЅРѕРіРѕ СЋР·РµСЂР° РІСЃС‘ РїСЂРёР»РѕР¶РµРЅРёРµ РїРµСЂРµРІРµРґРµРЅРѕ, Р°
  // СѓРІРµРґРѕРјР»РµРЅРёРµ РїСЂРёС…РѕРґРёР»Рѕ СЂСѓСЃСЃРєРёРј (Р°СѓРґРёС‚ 2026-08-17, Рї.в„–6). РџРµСЂРµРІРѕРґРѕРІ Р·РґРµСЃСЊ
  // РІР·СЏС‚СЊ РЅРµРѕС‚РєСѓРґР°: service worker Р¶РёРІС‘С‚ РѕС‚РґРµР»СЊРЅРѕ РѕС‚ СЃС‚СЂР°РЅРёС†С‹ Рё РЅРµ РІРёРґРёС‚
  // TRANSLATIONS, Р° push РјРѕР¶РµС‚ РїСЂРёР№С‚Рё РєРѕРіРґР° СЃС‚СЂР°РЅРёС†Р° РІРѕРѕР±С‰Рµ РЅРµ Р·Р°РїСѓСЃРєР°Р»Р°СЃСЊ.
  // РРјСЏ РїСЂРёР»РѕР¶РµРЅРёСЏ РЅРµР№С‚СЂР°Р»СЊРЅРѕ РІ Р»СЋР±РѕРј СЏР·С‹РєРµ. РќР° РїСЂР°РєС‚РёРєРµ РІРµС‚РєР° РїРѕС‡С‚Рё РјС‘СЂС‚РІР°СЏ вЂ”
  // СЃРµСЂРІРµСЂ РІСЃРµРіРґР° С€Р»С‘С‚ title (С‚РµРєСЃС‚ Р·Р°РґР°С‡Рё), СЃРј. sendDueReminders.
  var title = n.title || 'Mynado';
  var body  = n.body  || '';
  // tag РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РЈРќРРљРђР›Р¬РќР«Рњ РЅР° РєР°Р¶РґСѓСЋ Р·Р°РґР°С‡Сѓ. Р‘С‹Р» Р¶С‘СЃС‚РєРѕ 'reminder' Сѓ РІСЃРµС… вЂ”
  // РёР·-Р·Р° СЌС‚РѕРіРѕ Android СЃС‡РёС‚Р°Р» РєР°Р¶РґРѕРµ РЅРѕРІРѕРµ РЅР°РїРѕРјРёРЅР°РЅРёРµ РћР‘РќРћР’Р›Р•РќРР•Рњ СѓР¶Рµ
  // РІРёСЃСЏС‰РµРіРѕ РІ С€С‚РѕСЂРєРµ: С‚РµРєСЃС‚ РјРѕР»С‡Р° РїРѕРґРјРµРЅСЏР»СЃСЏ, Р±РµР· Р·РІСѓРєР°, РІРёР±СЂР°С†РёРё Рё РІСЃРїР»С‹РІР°СЋС‰РµР№
  // РїР»Р°С€РєРё. РџРѕРєР° РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ СЃРјР°С…РЅС‘С‚ РїСЂРµРґС‹РґСѓС‰РµРµ, РІСЃРµ СЃР»РµРґСѓСЋС‰РёРµ РїСЂРёС…РѕРґСЏС‚
  // РЅРµР·Р°РјРµС‚РЅРѕ вЂ” РІС‹РіР»СЏРґРёС‚ РєР°Рє В«СѓРІРµРґРѕРјР»РµРЅРёСЏ РІРѕРѕР±С‰Рµ РЅРµ РїСЂРёС…РѕРґСЏС‚В» (РЅР°Р№РґРµРЅРѕ РЅР°
  // СЂРµР°Р»СЊРЅРѕРј СѓСЃС‚СЂРѕР№СЃС‚РІРµ 2026-07-25 С‡РµСЂРµР· adb logcat + dumpsys notification).
  // РЎРµСЂРІРµСЂ РїСЂРёСЃС‹Р»Р°РµС‚ tag = syncId Р·Р°РґР°С‡Рё: СЂР°Р·РЅС‹Рµ Р·Р°РґР°С‡Рё РЅРµ РїРµСЂРµРєСЂС‹РІР°СЋС‚ РґСЂСѓРі
  // РґСЂСѓРіР°, Р° РїРѕРІС‚РѕСЂРЅР°СЏ РѕС‚РїСЂР°РІРєР° РўРћР“Рћ Р–Р• РЅР°РїРѕРјРёРЅР°РЅРёСЏ РїРѕ-РїСЂРµР¶РЅРµРјСѓ РЅРµ РїР»РѕРґРёС‚ РґСѓР±Р»РµР№.
  var tag = n.tag || ('reminder-' + Date.now());
  e.waitUntil(
    self.registration.showNotification(title, {
      // РЎРј. РєРѕРјРјРµРЅС‚Р°СЂРёР№ Сѓ РїРµСЂРІРѕРіРѕ showNotification РІС‹С€Рµ РїСЂРѕ icon vs badge.
      body: body,
      icon: 'apple-touch-icon.png',
      badge: 'icon-badge.png',
      tag: tag,
      renotify: true
    // Р‘РµР№РґР¶ СЃС‡РёС‚Р°РµРј РџРћРЎР›Р• РїРѕРєР°Р·Р° Рё РІРЅСѓС‚СЂРё waitUntil: СЂР°РЅСЊС€Рµ setAppBadge СЃС‚РѕСЏР»
    // РїРµСЂРІРѕР№ СЃС‚СЂРѕРєРѕР№ РѕР±СЂР°Р±РѕС‚С‡РёРєР°, РІРЅРµ waitUntil, Рё СЃРёСЃС‚РµРјР° Р±С‹Р»Р° РІРїСЂР°РІРµ СѓСЃС‹РїРёС‚СЊ
    // service worker РґРѕ С‚РѕРіРѕ, РєР°Рє РІС‹Р·РѕРІ РґРѕРµРґРµС‚.
    }).then(badgeSync, badgeSync)
  );
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  e.waitUntil(
    badgeSync().then(function(){ return clients.matchAll({type:'window'}); }).then(function(list){
      for(var i=0;i<list.length;i++) if('focus' in list[i]) return list[i].focus();
      if(clients.openWindow) return clients.openWindow('./');
    })
  );
});
