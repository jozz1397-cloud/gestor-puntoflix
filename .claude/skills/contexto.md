# Contexto del Gestor

Carga el mapa del archivo `puntoflix_firebase.html` para orientarte rápido sin leerlo completo.

## Instrucciones

Lee estas secciones en orden — son suficientes para entender el proyecto completo:

1. **Líneas 278–297** — Constantes de plataformas (`PLATS`, `PI`, `PLATCOLORS`, `PLAT_LIMITS`, `PLAT_URLS`) y array `COMBOS`
2. **Líneas 299–315** — Estado global `S` (todos los campos disponibles)
3. **Líneas 409–465** — Funciones helper clave: `gst`, `dl`, `fd`, `profInUse`, `profDisponibles`, `cliSt`, `cliDeuda`
4. **Líneas 617–648** — `saveSub` y `saveCuenta` (cómo se guardan suscripciones y cuentas)
5. **Líneas 1528–1642** — Todo el flujo de combos (`openCombo`, `renderComboMod`, `submitCombo`)
6. **Líneas 1784–1810** — Generadores de mensajes WhatsApp (`genWANuevaCuenta`, `genWACombo`)
7. **Líneas 1985–2070** — Modal de bienvenida (`renderWelcomeMod`, `cerrarWelcome`, `cpDatos`)
8. **Líneas 1658–1662** — Funciones globales: `setView`, `toggleDark`, `logout`

## Patrones clave a recordar

- `render()` = reconstruye todo el DOM. `renderCont()` = solo el área `.cont`
- `sv()` = guarda en Firebase + localStorage. `ld()` = carga al login
- WhatsApp: siempre `openWA(phone, msg)` o `waLink(phone, msg)` — nunca `wa.me` directo
- IDs: `gid()` genera IDs únicos para clientes, subs, pagos, cuentas
- Plataformas custom se guardan en `S.customPlats[]` y se fusionan con `PLATS` al cargar
