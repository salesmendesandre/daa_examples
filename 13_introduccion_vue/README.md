# 13 · Introducción a Vue 3

Este proyecto acompaña al capítulo **"Introducción a Vue.js"** del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/vue/c13_introduccion_vue.html). Aquí verás cómo levantar una aplicación con Vite, crear tu primer componente y montarlo en la página.

## Qué repasar antes
- Haber preparado el entorno según el capítulo [Configuración inicial de equipos](https://salesmendesandre.github.io/daa/configuracion_equipos.html).
- Tener instalado Node.js 20.19+ o 22.12+ (requisito de Vite) y npm.
- Tener instalada la extensión **Vue - Official** en VS Code y **Vue.js DevTools** en el navegador.

## Pasos principales del capítulo
1. Crear el scaffolding con Vite (`npm create vite@latest my-vue-app -- --template vue`).
2. Definir un componente con `<script setup>` (`src/components/Greeting.vue`).
3. Montar la aplicación y mostrar datos reactivos en la vista (`src/main.js`, `src/App.vue`).

## Cómo ejecutar el ejemplo
```bash
npm install
npm run dev
```

Visita `http://localhost:5173` y modifica `src/App.vue` para replicar los ejercicios guiados en el libro.
