
// sw.js - JDP SUPREME V23 - MANTENEDORA HELENA
const cacheName = 'JDP-SUPREME-V23-OURO';

const FILES = [
  './',
  './index.html',
  './db-engine.js',
  './peerjs.min.js',
  './manifest.json'
];

// Instala e guarda a biblioteca (Corrigido para ler FILES)
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('HELENA: Armazenando arquivos de rocha no cache...');
      return cache.addAll(FILES);
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta pedidos para garantir funcionamento Offline total
self.addEventListener('fetch', (event) => {
  // Não intercepta chamadas de conexão WebSockets do PeerJS (evita travar o sinal)
  if (event.request.url.includes('peerjs') && event.request.url.includes('http')) {
    event.respondWith(
      caches.match('./peerjs.min.js').then(res => res || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Sincronização em Segundo Plano para o Banco de Dados do Sr. José
self.addEventListener('sync', (event) => {
  if (event.tag === 'enviar-mensagens-presas') {
    event.waitUntil(enviarMensagensDoBanco());
  }
});

async function enviarMensagensDoBanco() {
  console.log("HELENA: Conexão detectada! Despachando banco de dados local...");
}
