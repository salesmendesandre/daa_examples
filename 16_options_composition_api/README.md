# Options API vs Composition API

Este ejemplo acompaña el capítulo 16, «Options API vs Composition API», del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/). Presenta dos implementaciones equivalentes para un contador, una basada en Options API y otra en Composition API.

## Qué analizar
- Cómo se estructura el mismo flujo con `data`, `computed` y `methods` frente a `ref` y `computed`.
- Ventajas de agrupar lógica por opciones versus por funcionalidades.
- Legibilidad de cada enfoque y cómo afecta a la reutilización de código.

## Ejecución
```bash
npm install
npm run dev
```

Abre `src/components/ContadorOptions.vue` y `src/components/ContadorComposition.vue`. Reflexiona sobre estas preguntas: ¿cómo extraerías la lógica en un composable? ¿Qué ocurriría al añadir watchers o efectos secundarios?
