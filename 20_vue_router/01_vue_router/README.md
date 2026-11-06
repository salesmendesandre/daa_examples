# Router básico: Home y About

Ejemplo que acompaña al capítulo 20, **"Vue Router: navegación entre vistas"**, del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/vue/c20_vue_router.html). Muestra la configuración mínima de Vue Router y el uso de `<RouterLink>` / `<RouterView>`.

## Qué encontrarás
- `src/router/index.js` con `createRouter` y `createWebHistory`, más dos rutas (`/` y `/about`) con nombres declarados.
- `App.vue` actuando como layout: encabezado con navegación SPA y el `<router-view>` para cargar cada vista.
- Vistas `HomeView` y `AboutView` para practicar navegación sin recargar la página.

## Cómo correrlo
```
npm install
npm run dev
```

Explora `src/views` para extender el ejemplo con nuevas páginas, middlewares o navegación programática tal como se propone en el capítulo.
