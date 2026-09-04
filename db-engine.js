// db-engine.js - Gestão de Dados Offline JDP
const DB_NAME = 'JDP_SUPREME_DB';
const STORE_NAME = 'mensagens_pendentes';

function abrirBanco() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function salvarNoBancoLocal(msg) {
    const db = await abrirBanco();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.add(msg);
    return tx.complete;
}

async function buscarMensagensPendentes() {
    const db = await abrirBanco();
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
    });
}

async function limparMensagensEnviadas() {
    const db = await abrirBanco();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
}
