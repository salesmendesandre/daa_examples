# Composición con slots

Ejemplo práctico del capítulo “Interpolación, Directivas y Slots” del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/vue/c15_plantillas_directivas.html). Explora slots por defecto, slots nombrados y cómo pasar acciones a componentes contenidos.

## Qué practicarás
- Añadir contenido variable dentro de componentes (`TarjetaBase`).
- Usar slots nombrados (`#titulo`, `#acciones`) para estructurar layout (`TarjetaSecciones`).
- Pasar callbacks (`notificar`) y utilizarlas dentro del slot de acciones.

## Ejecución
```bash
npm install
npm run dev
```

Edita `TarjetaSecciones.vue` para incluir un `slot` adicional (por ejemplo, `#resumen`) y conecta los cambios con los ejercicios del capítulo sobre composición de interfaces.
