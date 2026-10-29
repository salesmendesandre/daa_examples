# Composables: reutilización de lógica

Este ejemplo acompaña el capítulo 19, [«Composables: reutilización de lógica con la Composition API»](https://salesmendesandre.github.io/daa/vue/c19_composables.html), del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/). Reúne varios composables escritos desde cero en `src/composables/` y un componente de demostración para cada uno.

## Qué encontrarás
- `useContador`: estado (`ref`), valores derivados (`computed`) y funciones devueltas como un objeto de refs. `ContadorDemo` muestra que cada llamada crea un estado independiente.
- `useEventListener`, `useRaton` y `useTamanoVentana`: composables que registran listeners en `onMounted` y los eliminan en `onUnmounted`. En `App.vue` puedes ocultar `SeguimientoRaton` para comprobar la limpieza.
- `useLocalStorage`: un `ref` sincronizado con `localStorage` mediante `watch` profundo y `JSON.parse`/`JSON.stringify` (`NotasPersistentes`).
- `useFetch`: carga asíncrona que devuelve `{ data, error, cargando, recargar }`, acepta un valor, un ref o un getter como URL (`toValue()`) y cancela peticiones obsoletas con `AbortController` y `onWatcherCleanup()` (`ListaRemota`). Los datos son archivos JSON estáticos de `public/datos/`, así que el ejemplo funciona sin conexión.

## Cómo ejecutarlo
```bash
npm install
npm run dev
```

Abre la aplicación, añade notas y recarga la página para ver que persisten; cambia el origen de datos de la lista (incluida la opción que provoca un error) y observa cómo cambian `cargando`, `data` y `error`. En el capítulo 23 aplicarás el mismo patrón de `useFetch` a la API del curso.
