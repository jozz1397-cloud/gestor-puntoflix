# Add Platform

Agrega una nueva plataforma de streaming al gestor PuntoFlix.

## Archivo objetivo
`puntoflix_firebase.html` — todas las ediciones son en las líneas 278–287.

## Los 5 lugares que SIEMPRE debes editar (en orden)

**Línea 278 — `PLATS`**: array de nombres. Insertar ANTES de `'Otro'`:
```js
const PLATS=['Netflix','Disney+',...,'NUEVA_PLATAFORMA','Otro'];
```

**Línea 282 — `PI`**: emoji del ícono:
```js
const PI={...,'NUEVA_PLATAFORMA':'🎯',...};
```

**Línea 284 — `PLAT_LIMITS`**: máximo de perfiles por cuenta:
```js
const PLAT_LIMITS={...,'NUEVA_PLATAFORMA':4,...};
```

**Línea 286 — `PLATCOLORS`**: color hex de la plataforma:
```js
const PLATCOLORS={...,'NUEVA_PLATAFORMA':'#xxxxxx',...};
```

**Línea 287 — `PLAT_URLS`**: URL de login (vacío si no aplica):
```js
const PLAT_URLS={...,'NUEVA_PLATAFORMA':'https://...',...};
```

## Instrucciones

Pide al usuario:
1. Nombre exacto de la plataforma
2. Emoji representativo
3. Máximo de perfiles por cuenta
4. Color hex (o sugerirle uno basado en el branding)
5. URL de login (opcional)

Luego edita los 5 lugares en orden. No olvides ninguno — si falta alguno la plataforma aparecerá sin color, sin ícono o sin límite de perfiles.
