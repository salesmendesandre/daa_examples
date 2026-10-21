# Herencia de atributos con `$attrs`

Ejemplo asociado al capítulo “Configuración y Componentes” del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/vue/c14_configuracion_componentes.html). Muestra cómo permitir que un componente pase atributos arbitrarios a su elemento raíz.

## Objetivos
- Entender la herencia automática de atributos (`inheritAttrs: true`, valor por defecto).
- Comprobar cómo atributos no declarados como props (`type`, `aria-*`, clases adicionales) llegan al elemento raíz.
- Saber cuándo desactivarla con `inheritAttrs: false` y reenviar `$attrs` a mano (explicado en el libro).

## Cómo ejecutarlo
```bash
npm install
npm run dev
```

Revisa `src/components/BotonBasico.vue`, añade nuevos atributos desde `src/App.vue` y confirma en las DevTools que llegan al elemento final. Este patrón es el que se recomienda en el capítulo para componentes altamente reutilizables.
