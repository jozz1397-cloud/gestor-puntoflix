# Add Combo

Agrega un nuevo combo predefinido al gestor PuntoFlix.

## Archivo objetivo
`puntoflix_firebase.html` — líneas 292–297.

## Estructura actual
```js
const COMBOS=[
  {id:'c1',nombre:'Disney+ & Crunchyroll',apps:['Disney+','Crunchyroll'],precio:6},
  {id:'c2',nombre:'Disney+ & Paramount+',apps:['Disney+','Paramount+'],precio:6},
  {id:'c3',nombre:'Disney+ & Prime Video',apps:['Disney+','Amazon Prime'],precio:6},
  {id:'c4',nombre:'Disney+ & HBO Max',apps:['Disney+','HBO Max'],precio:6},
];
```

## Instrucciones

Pide al usuario:
1. Las plataformas que incluye el combo (deben existir en `PLATS`)
2. El precio del combo

Luego agrega la entrada al array `COMBOS`:
- `id`: siguiente en secuencia (`c5`, `c6`, etc.)
- `nombre`: formato `"Plataforma1 & Plataforma2"`
- `apps`: nombres exactos como aparecen en `PLATS`
- `precio`: número

Los nombres en `apps` deben coincidir exactamente con los valores de `PLATS` (línea 278), o el ícono y color no cargarán correctamente.
