# WhatsApp Template

Carga y trabaja con los generadores de mensajes WhatsApp del gestor.

## Ubicaciones exactas

| Función | Línea aprox. | Uso |
|---|---|---|
| `genWANuevaCuenta(c, s)` | ~1755 | Datos de acceso para 1 suscripción nueva |
| `genWACombo(c, subs)` | ~1784 | Datos de acceso para combo (múltiples plataformas) |
| `genWARenovar(c, s)` | ~1803 | Recordatorio de renovación próxima |
| `genWAauto(c, s)` | ~1805 | Auto-detecta si vencido o por vencer |
| `genWAMsg(c, tpl)` | ~502 | Mensaje masivo (tpl: 'venc','vencido','cobro','all') |
| `genWAConfirmacion(p, c)` | ~515 | Confirmación de pago recibido |

## Instrucciones

1. Lee las funciones indicadas para entender la estructura actual del mensaje
2. Todos los mensajes usan formato WhatsApp: `*negrita*`, saltos de línea con `\n`
3. El nombre del negocio viene de `S.biz` (configurable en Settings)
4. Fechas: usar `fd(date)` para formato `DD/MM/YYYY` y `fdRel(date)` para fechas relativas (`*mañana*`, `*en 3 días*`)
5. Precios: usar `precioMostrar(s)` — toma del catálogo si existe, o del precio guardado
6. Al modificar un template, actualizar también `genWACombo` si aplica al flujo de combos

## Patrón de envío

- Con teléfono: `openWA(phone, msg)` abre WhatsApp directamente
- En `<a href>`: `waLink(phone, msg)` genera el URL
- Nunca construir URLs de `wa.me` manualmente
