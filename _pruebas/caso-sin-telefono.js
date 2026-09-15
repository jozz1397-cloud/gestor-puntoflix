// Se ejecuta DENTRO del contexto del VM, para ver los `let/const` del script (S, etc.)
toast = function (m) { __toasts.push(String(m).replace(/<[^>]*>/g, '')); };

S.clients = [
  { id: 'c1', name: 'Madrizboss', phone: '', clientStatus: 'Activo', subs: [
    { id: 's1', platform: 'Amazon Prime', price: '3', accountEmail: 'pf@x.com', password: 'abc',
      profile: 'P1', profilePin: '1234', startDate: '2026-08-15', endDate: '2026-09-15' } ] },
  { id: 'c2', name: 'Con Tel', phone: '0999123456', clientStatus: 'Activo', subs: [
    { id: 's2', platform: 'Netflix', price: '4', accountEmail: 'nf@x.com', password: 'zzz',
      startDate: '2026-08-15', endDate: '2026-09-15' } ] }
];
S.pagos = []; S.cuentas = []; S.proveedores = []; S.countryCode = '593';

function probar(nombre, fn) {
  __reset();
  try { fn(); } catch (e) { if (!__copiado()) { console.log('FALLA  ' + nombre + ' -> EXCEPCION: ' + e.message); return; } console.log('       (el render posterior falla por el DOM falso del test, no por la copia)'); }
  if (__copiado()) console.log('COPIA  ' + nombre + ' -> ' + __copiado().length + ' car.: "' + __copiado().split('\n')[0].slice(0, 46) + '"');
  else if (__abiertos().length) console.log('WA     ' + nombre + ' -> abrio WhatsApp');
  else console.log('FALLA  ' + nombre + ' -> no copio nada. toasts: ' + JSON.stringify(__toasts));
}

console.log('\n== Cliente SIN telefono (Madrizboss) ==');
probar('Avisar renovacion (boton chat)', function () { avisarRenovacionCliente('c1'); });
probar('Recordar que pague (menu)', function () { avisarRenovacionSmart('c1', 's1'); });
probar('Avisar vencimiento', function () { avisarVencimiento('c1', 's1'); });
probar('Confirmar pago y nueva fecha', function () { waConfirmacionRenovacion('c1', 's1'); });
probar('Datos actualizados', function () { waActualizacion('c1', 's1'); });
probar('Bienvenida / datos de acceso', function () { waNuevaCuenta('c1', 's1'); });
probar('Copiar actualizacion (modal)', function () { cpActualizacion('c1', 's1'); });
probar('Comprobante de pago', function () {
  S.pagos = [{ id: 'p1', clientId: 'c1', clientName: 'Madrizboss', platform: 'Amazon Prime', monto: 3, fecha: '2026-09-15', endDate: '2026-10-15', subIds: ['s1'] }];
  enviarConfirmacionPago('p1');
});

console.log('\n== Cliente CON telefono (control: debe abrir WhatsApp) ==');
probar('Avisar renovacion', function () { avisarRenovacionCliente('c2'); });
probar('Confirmar renovacion', function () { waConfirmacionRenovacion('c2', 's2'); });

console.log('\n== Listas de cobro ==');
var lista = getListaEnvio('todos');
console.log((lista.some(function (g) { return g.c.id === 'c1'; }) ? 'OK   ' : 'FALLA') + ' getListaEnvio incluye al cliente sin telefono (' + lista.length + ' grupos)');
S.seguimientoDias = 1;
S.clients[0].subs[0].endDate = '2026-09-01';
S.clients[1].subs[0].endDate = '2026-09-01';
var seg = getSeguimiento();
console.log((seg.some(function (g) { return g.c.id === 'c1'; }) ? 'OK   ' : 'FALLA') + ' getSeguimiento incluye al cliente sin telefono (' + seg.length + ' grupos)');

console.log('\n== HTML de los botones ==');
var msgRaro = 'Hola *Madrizboss*\n Renuevas? "ya" & <ok>';
var bSin = btnMsg(S.clients[0], msgRaro, { cls: 'btn bw', wa: 'Enviar', cp: 'Copiar', onclick: "marcarEnviadoItems('c1:s1',true)" });
var bCon = btnMsg(S.clients[1], 'Hola *Con Tel*', { cls: 'btn bw', wa: 'Enviar', cp: 'Copiar' });
var attr = bSin.match(/data-msg="([^"]*)"/)[1];
console.log((/^<button/.test(bSin) && !/[<>"]/.test(attr) ? 'OK   ' : 'FALLA') + ' sin telefono -> <button> con data-msg escapado');
console.log((/^<a href="https:\/\/api\.whatsapp\.com/.test(bCon) ? 'OK   ' : 'FALLA') + ' con telefono -> <a> a WhatsApp');
console.log('       ' + bSin.slice(0, 155));

var desesc = attr.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
__reset();
cpMsgBtn({ dataset: { msg: desesc } });
console.log((__copiado() === msgRaro.replace(/\*/g, '') ? 'OK   ' : 'FALLA') + ' cpMsgBtn devuelve el texto integro sin asteriscos -> ' + JSON.stringify(__copiado()));

console.log('\n== Menu de avisos ==');
var menu = _avisosMenu('c1', 's1', '2026-09-01', "avisarRenovacionSmart('c1','s1')", 'Recordar que pague');
console.log((menu.indexOf('waConfirmacionRenovacion') >= 0 && menu.indexOf('avisarRenovacionSmart') >= 0 ? 'OK   ' : 'FALLA') + ' _avisosMenu genera las 2 opciones sin exigir telefono');

console.log('\n== Filas renderizadas (cliente sin telefono) ==');
try {
  var fila = renderClientRow(S.clients[0], 0);
  console.log((fila.indexOf("avisarRenovacionSmart('c1','s1')") >= 0 ? 'OK   ' : 'FALLA') + ' fila de escritorio: menu con \"Recordar que pague\"');
  console.log((fila.indexOf("waConfirmacionRenovacion('c1','s1')") >= 0 ? 'OK   ' : 'FALLA') + ' ...y la opcion "Confirmar pago" del menu');
  S.expanded = new Set(['m_c1']);
  var card = renderMobileCard(S.clients[0]);
  console.log((card.indexOf("avisarRenovacionCliente('c1')") >= 0 ? 'OK   ' : 'FALLA') + ' tarjeta movil trae el boton de aviso');
  console.log((card.indexOf("avisarVencimiento('c1','s1')") >= 0 ? 'OK   ' : 'FALLA') + ' tarjeta movil trae "Copiar aviso" de vencimiento');
} catch (e) { console.log('FALLA render: ' + e.message); }

try {
  S.enviarDia = 'todos'; S.cobrosTab = 'avisar';
  var body = _cobrosAvisarBody();
  console.log((body.indexOf('data-msg=') >= 0 ? 'OK   ' : 'FALLA') + ' pestana Avisar pinta boton Copiar para el cliente sin telefono');
  var body2 = _cobrosSeguirBody();
  console.log((body2.indexOf('data-msg=') >= 0 ? 'OK   ' : 'FALLA') + ' pestana Seguimiento pinta boton Copiar para el cliente sin telefono');
} catch (e) { console.log('FALLA cobros: ' + e.message); }

console.log('\n== Control: nada quedo colgando de "no tiene telefono" ==');
console.log((typeof _waEnviar === 'function' && _waEnviar.length === 2 ? 'OK   ' : 'FALLA') + ' _waEnviar ya no acepta requierePhone (arity=' + _waEnviar.length + ')');
