# Composables: reutilización de lógica

Este ejemplo acompaña el capítulo 19, [«Composables: reutilización de lógica con la Composition API»](https://salesmendesandre.github.io/daa/main/vue/c19_composables.html), del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/). Contiene dos composables escritos desde cero en `src/composables/` y un componente de demostración para cada uno.

## Qué contiene
- `useContador`: estado (`ref`), un valor derivado (`computed`) y funciones devueltas en un objeto. `ContadorDemo` lo usa dos veces y muestra que cada llamada crea un estado independiente.
- `useRaton`: sigue la posición del ratón. Registra el *listener* en `onMounted` y lo elimina en `onUnmounted`. En `App.vue` se puede ocultar `SeguimientoRaton` para comprobar la limpieza.

## Cómo ejecutarlo
```bash
npm install
npm run dev
```
