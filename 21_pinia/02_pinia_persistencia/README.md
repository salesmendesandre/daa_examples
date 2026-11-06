# Estado global con Pinia guardado en el navegador

Ejemplo asociado al capítulo [«Pinia: estado global»](https://salesmendesandre.github.io/daa/main/vue/c21_pinia.html) del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/). Es el mismo carrito de `01_pinia`, pero su contenido se conserva al recargar la página gracias a `localStorage`.

## Qué cambia respecto a `01_pinia`
- `src/stores/carrito.js`: el estado inicial se lee de `localStorage` (o es una lista vacía si no hay nada guardado).
- `App.vue`: un `watch` guarda los productos en `localStorage` cada vez que cambian.

## Cómo ejecutarlo
```bash
npm install
npm run dev
```

Para ver lo guardado: herramientas de desarrollo del navegador, pestaña **Application** (o **Almacenamiento**) → **Local Storage**.
