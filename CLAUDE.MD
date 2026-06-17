# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deploy

Editar `puntoflix_firebase.html` dispara automáticamente el hook en `~/.claude/settings.json` que copia y despliega a Firebase. Si falla el hook:

```powershell
copy "C:\Users\jozz1\Downloads\GESTOR DE USUARIOS\puntoflix_firebase.html" C:\puntoflix\public\index.html
cd C:\puntoflix && firebase deploy --only hosting
```

Live: https://gestor-puntoflix.web.app · Proyecto Firebase: `gestor-puntoflix`

## Arquitectura

Un solo archivo HTML (~2800 líneas). Sin build. HTML + CSS + JS inline.

**Estado global:** objeto `S` (~línea 299). `render()` reconstruye el DOM completo. `renderCont()` solo rerenderiza `.cont` (más ligero).

**Persistencia:** `sv()` guarda en Firestore + localStorage de emergencia. `ld()` carga al login con fallback local. Datos en `usuarios/{uid}` como JSON strings.

**Datos principales:**
- `S.clients[]` → cada cliente tiene `subs[]` (plataforma, email, password, perfil, endDate, price, masterAccountId)
- `S.cuentas[]` → cuentas maestras (las que paga el dueño)
- `S.pagos[]` → historial de cobros
- `S.papelera[]` → clientes eliminados (recuperables)
- `S.catalogo` → precios por plataforma

**Plataformas:** arrays globales `PLATS`, `PLATCOLORS`, `PI` (emojis), `PLAT_LIMITS`, `PLAT_URLS`. Plataformas custom en `S.customPlats[]`, se fusionan al cargar.

**Combos:** constante `COMBOS` (~línea 292). `submitCombo()` crea/añade subs. Estado relevante: `S.comboClientMode` ('new'|'existing'), `S.comboEnd` (fecha persistida entre renders), `S.comboSel`, `S.comboClientId`.

**Modal de bienvenida** (`renderWelcomeMod`): detecta combo vía `S.welcomeComboSIds` (array de IDs). Si length > 1, usa `genWACombo()` en vez de `genWANuevaCuenta()`.

**WhatsApp:** siempre usar `openWA(phone, msg)` o `waLink(phone, msg)` para `<a href>`. No usar `wa.me` directamente.

**Perfiles de cuenta:** `profInUse(caId)` cuenta perfiles ocupados + ajuste manual. `profDisponibles(caId)` = total - ocupados.
