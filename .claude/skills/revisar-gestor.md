# Revisar Gestor

Auditoría rápida de `puntoflix_firebase.html` para detectar bugs comunes antes del deploy.

## Instrucciones

Ejecuta estas verificaciones en orden leyendo solo las secciones necesarias:

### 1. Variables de estado inicializadas (líneas 299–315)
Verifica que toda variable usada en el código tenga valor inicial en el objeto `S`. Busca con Grep cualquier `S\.` nuevo que no esté en la declaración.

### 2. Consistencia de plataformas en COMBOS (líneas 292–297 y 278)
Cada nombre en `apps:[]` de `COMBOS` debe existir exactamente en `PLATS`. Busca discrepancias de mayúsculas o nombres distintos.

### 3. IDs de combos secuenciales (líneas 292–297)
Los IDs `c1`, `c2`... deben ser consecutivos sin saltos ni duplicados.

### 4. Plataformas completas (líneas 278–287)
Toda plataforma en `PLATS` debe tener entrada en `PI`, `PLATCOLORS`, `PLAT_LIMITS` y `PLAT_URLS`. Una entrada faltante causa errores visuales silenciosos.

### 5. Funciones críticas con null checks
Grep para `S.welcomeComboSIds`, `S.comboClientId`, `S.comboEnd` — verificar que se usen con guards (`&&`, `?.`, `||`).

### 6. Generadores WA retornan string válido
Las funciones `genWANuevaCuenta`, `genWACombo`, `genWARenovar` deben terminar con `return msg`. Grep para verificar.

## Reporte

Al terminar, muestra:
- ✅ lo que está bien
- ⚠️ advertencias menores
- ❌ bugs que requieren fix inmediato
