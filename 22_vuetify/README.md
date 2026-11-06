# Vuetify: instalación y configuración (Vue 3 + Vite)

Ejemplo del capítulo [«Instalación y Configuración de Vuetify»](https://salesmendesandre.github.io/daa/main/vue/c22_vuetify.html) del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/). Un botón de Vuetify que muestra un aviso con `v-snackbar`.

## Qué contiene
- `src/plugins/vuetify.js`: crea Vuetify con `createVuetify`, carga sus estilos y los iconos de Material Design Icons.
- `src/main.js`: registra Vuetify en la aplicación con `app.use(vuetify)`.
- `vite.config.js`: el plugin `vite-plugin-vuetify` importa automáticamente los componentes que aparecen en las plantillas.
- `src/App.vue`: usa `<v-btn>` y `<v-snackbar>` sin importarlos; al pulsar el botón aparece el aviso.

## Cómo ejecutarlo
```bash
npm install
npm run dev
```
