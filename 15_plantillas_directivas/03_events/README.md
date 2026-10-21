# Eventos en componentes y formularios

Proyecto ilustrativo del capítulo “Interpolación, Directivas y Slots” del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/vue/c15_plantillas_directivas.html). Reúne ejemplos de escucha de eventos en botones, formularios y campos controlados.

## Conceptos clave
- Eventos básicos (`@click`) y personalizados con parámetros.
- Uso de modificadores como `@submit.prevent` y `@keyup.escape`.
- Gestión de estado reactivo y mensajes de feedback (`FormularioLogin.vue`).

## Cómo correrlo
```bash
npm install
npm run dev
```

Interactúa con cada componente del directorio `src/components/`. Añade tus propios listeners (por ejemplo, `@blur` o `@keyup.enter` en una caja de búsqueda fuera de un formulario) tal como propone el libro para afianzar el control de eventos.
