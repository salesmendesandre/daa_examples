# Rutas dinámicas con parámetros

Proyecto alineado al capítulo 20, **"Vue Router: navegación entre vistas"**, del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/vue/c20_vue_router.html). Su objetivo es ilustrar cómo declarar rutas con segmentos variables y leerlos desde los componentes.

## Qué encontrarás
- `src/router/index.js` con la ruta `/usuarios/:id`, activando `props: true` para inyectar el parámetro como prop.
- `App.vue` con botones que navegan programáticamente (`router.push`) a distintos IDs.
- `UsuarioDetalle.vue` usando `useRoute()` y `computed` para reaccionar cuando cambia `route.params.id`.
- Un layout sencillo donde cada navegación modifica sólo el contenido de la vista, sin recargar la aplicación.

## Cómo correrlo
```
npm install
npm run dev
```

Prueba URLs como `/usuarios/10` o `/usuarios/99` y extiende el componente para obtener datos reales, tal como se propone en los retos del capítulo.
