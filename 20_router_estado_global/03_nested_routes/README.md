# Rutas anidadas para un CRUD

Ejemplo vinculado al capítulo 20, **"Ruteo y Estado Global"**, del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/vue/c20_vue_router.html). Muestra cómo estructurar un flujo CRUD dentro de un layout padre que mantiene navegación y acciones comunes.

## Qué encontrarás
- `ProductosLayout.vue` funcionando como contenedor con un `<RouterView>` secundario y enlaces hacia cada operación.
- Rutas hijas para `/productos`, `/productos/nuevo`, `/productos/:id` y `/productos/:id/editar`, configuradas en `src/router/index.js`.
- Componentes simples para listar, crear, detallar y editar productos, listos para conectar con un store o una API.

## Cómo correrlo
```
npm install
npm run dev
```

Utiliza la navegación lateral para recorrer cada estado del CRUD y adapta los componentes según tu dominio, tal como se sugiere en el capítulo.
