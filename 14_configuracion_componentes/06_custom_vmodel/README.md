# `v-model` personalizado (`update:modelValue`)

Ejemplo complementario al capítulo “Configuración y Componentes” del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/vue/c14_configuracion_componentes.html). Enseña a crear componentes que exponen su propio `v-model`.

## Lo que practicarás
- Definir props obligatorias (`modelValue`, `label`).
- Emitir el evento `update:modelValue` para sincronizar el valor con el padre.
- Encapsular estilos y plantillas reutilizables.
- Comparar esta versión explícita con la macro `defineModel()` (Vue 3.4+), descrita en el libro.

## Pasos para ejecutarlo
```bash
npm install
npm run dev
```

Modifica `CampoTexto.vue` para añadir validaciones (por ejemplo, `maxlength` o `type="email"`) y comprueba cómo el componente padre sigue recibiendo las actualizaciones, tal como se detalla en el libro.
