# Formularios y modificadores de eventos

Colección de ejemplos que acompaña el capítulo 18, «Manejo de Formularios», del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/). Incluye campos enlazados con `v-model`, validaciones básicas y modificadores.

## Qué encontrarás
- Componentes simples (`CampoCorreo`) para practicar `v-model` con inputs específicos.
- Formularios con envío controlado (`@submit.prevent`), validez derivada con `computed` (`FormularioContacto`) y mensajes de error (`FormularioValidacion`).
- Modificadores de `v-model` (`.lazy`, `.trim`, `.number`) en `ModificadoresDemo` y el modificador de evento `.prevent` en el envío de formularios.

## Cómo ejecutarlo
```bash
npm install
npm run dev
```

Interactúa con cada sección dentro de `src/App.vue`. Ajusta las reglas de validación y observa cómo cambian los mensajes; replica las actividades propuestas en el capítulo para afianzar el manejo de inputs múltiples.
