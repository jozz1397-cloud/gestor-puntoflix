// Banco de pruebas SIN navegador: carga el JS inline de la app en un VM con un DOM falso mínimo y deja
// correr aserciones REALES sobre las funciones (no solo sintaxis). Uso: node _pruebas/harness.js
// Las aserciones viven en caso-sin-telefono.js, que corre DENTRO del contexto para ver los let/const (S).
const fs = require('fs'), vm = require('vm');
const html = fs.readFileSync(__dirname + '/../puntoflix_firebase.html', 'utf8');
const partes = html.split(/<script[^>]*>/);
const js = partes[partes.length - 1].split('</script>')[0];

let copiado = null, toasts = [], abiertos = [];

function el() {
  return {
    style: {}, dataset: {}, value: '', checked: false, innerHTML: '', textContent: '', className: '',
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    appendChild() {}, remove() {}, addEventListener() {}, removeEventListener() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
    focus() {}, click() {}, closest() { return null; },
    getBoundingClientRect() { return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }; }
  };
}

const doc = {
  createElement: el, getElementById(id) { return id === 'root' ? el() : null; }, querySelector() { return null; },
  querySelectorAll() { return []; }, addEventListener() {}, readyState: 'complete',
  body: el(), documentElement: el(), head: el()
};

const store = {};
const noop = function () {};
const stubDoc = { get() { return Promise.resolve({ exists: false }); }, set() { return Promise.resolve(); }, onSnapshot() { return noop; } };
const stubCol = { doc() { return stubDoc; }, get() { return Promise.resolve({ empty: true, docs: [] }); } };
const stubDb = { collection() { return stubCol; }, doc() { return stubDoc; }, enablePersistence() { return Promise.resolve(); }, settings: noop, waitForPendingWrites() { return Promise.resolve(); }, batch() { return { set: noop, update: noop, delete: noop, commit() { return Promise.resolve(); } }; } };

const ctx = {};
ctx.console = console;
ctx.setTimeout = function () { return 0; };
ctx.clearTimeout = noop;
ctx.setInterval = function () { return 0; };
ctx.clearInterval = noop;
ctx.document = doc;
ctx.navigator = {
  userAgent: 'node',
  clipboard: { writeText(t) { copiado = t; return Promise.resolve(); } },
  serviceWorker: { register() { return Promise.reject(new Error('no sw')); } }
};
ctx.localStorage = {
  getItem(k) { return k in store ? store[k] : null; },
  setItem(k, v) { store[k] = String(v); },
  removeItem(k) { delete store[k]; }
};
ctx.location = { href: 'http://x/', hostname: 'x', reload: noop };
ctx.matchMedia = function () { return { matches: false, addEventListener: noop, addListener: noop }; };
ctx.firebase = {
  initializeApp() { return {}; },
  auth() { return { onAuthStateChanged: noop, currentUser: null }; },
  firestore: Object.assign(function(){ return stubDb; }, { FieldValue:{ serverTimestamp(){return 0;} }, Timestamp:{ now(){return 0;} } })
};
ctx.alert = noop;
ctx.confirm = function () { return false; };
ctx.prompt = function () { return null; };
ctx.open = function (u) { abiertos.push(u); return null; };
ctx.fetch = function () { return Promise.reject(new Error('sin red')); };
ctx.Intl = Intl; ctx.URL = URL; ctx.URLSearchParams = URLSearchParams;
ctx.TextEncoder = TextEncoder; ctx.TextDecoder = TextDecoder; ctx.Promise = Promise;
ctx.addEventListener = noop; ctx.removeEventListener = noop; ctx.dispatchEvent = noop;
ctx.requestAnimationFrame = function () { return 0; }; ctx.cancelAnimationFrame = noop;
ctx.scrollTo = noop; ctx.innerWidth = 1200; ctx.innerHeight = 800; ctx.devicePixelRatio = 1;
ctx.getComputedStyle = function () { return { getPropertyValue() { return ''; } }; };
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;

ctx.__toasts = toasts;
ctx.__copiado = function () { return copiado; };
ctx.__abiertos = function () { return abiertos; };
ctx.__reset = function () { copiado = null; abiertos.length = 0; toasts.length = 0; };

vm.createContext(ctx);
try { vm.runInContext(js, ctx, { timeout: 20000 }); } catch (e) { console.log("AVISO carga: " + e.message); }
vm.runInContext(fs.readFileSync(__dirname + "/caso-sin-telefono.js", "utf8"), ctx, { timeout: 20000 });
