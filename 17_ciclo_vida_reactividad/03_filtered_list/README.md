# Lista filtrada con propiedades computadas

Ejercicio alineado con el capítulo 17, «Ciclo de vida, reactividad y optimización», del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/). Muestra cómo derivar resultados optimizados a partir del estado usando `computed`.

## Objetivos
- Crear filtros reactivos basados en la entrada del usuario.
- Evitar recomputaciones innecesarias al derivar datos con `computed`.
- Aplicar buenas prácticas para listas renderizadas con `v-for`.

## Cómo ejecutarlo
```bash
npm install
npm run dev
```

Prueba diferentes términos en el campo de búsqueda y observa cómo se actualiza la lista. Añade una propiedad calculada adicional (por ejemplo, ordenar por precio) tal como se sugiere en el capítulo para extender el caso práctico.
