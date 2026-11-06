# PrimeVue: instalación y configuración (Vue 3 + Vite)

Ejemplo del capítulo [«Instalación y Configuración de PrimeVue»](https://salesmendesandre.github.io/daa/main/vue/c22_primevue.html) del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/). Un botón de PrimeVue que muestra una notificación con `Toast`.

## Qué contiene
- `src/main.js`: registra PrimeVue con el tema Aura, los iconos de PrimeIcons y `ToastService`.
- `src/style.css`: carga Tailwind CSS con `@import "tailwindcss"`.
- `vite.config.js`: plugins de Tailwind CSS y de importación automática de componentes (`unplugin-vue-components` con `PrimeVueResolver`).
- `src/App.vue`: usa `<Button>` y `<Toast>` sin importarlos; al pulsar el botón aparece la notificación.

## Cómo ejecutarlo
```bash
npm install
npm run dev
```
