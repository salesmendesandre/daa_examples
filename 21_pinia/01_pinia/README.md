# Estado global con Pinia

Ejemplo asociado al capítulo [«Pinia: estado global»](https://salesmendesandre.github.io/daa/main/vue/c21_pinia.html) del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/). Un carrito de la compra muestra cómo dos componentes independientes comparten el mismo estado.

## Qué contiene
- `src/stores/carrito.js`: el *store* `useCarritoStore`, con el estado (`productos`), dos getters (`cantidad` y `total`) y dos acciones (`anadir` y `vaciar`).
- `Catalogo.vue`: lista de productos con un botón «Añadir» que llama a `carrito.anadir(producto)`.
- `ResumenCarrito.vue`: muestra el número de productos y el total, y permite vaciar el carrito.
- `App.vue`: muestra los dos componentes; al añadir desde el catálogo, el resumen se actualiza sin *props* ni eventos entre ellos.

## Cómo ejecutarlo
```bash
npm install
npm run dev
```
