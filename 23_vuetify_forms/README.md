# Formularios con Vuetify y Zod

Ejemplo del capítulo [«Formularios con Vuetify y Zod»](https://salesmendesandre.github.io/daa/main/vue/c23_vuetify_forms.html) del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/). Un formulario de producto que valida sus campos con un esquema de Zod y muestra los errores con los componentes de Vuetify.

## Qué contiene
- `src/components/ProductForm.vue`: el esquema de Zod, la función `regla()` que lo conecta con la propiedad `rules` de cada `<v-text-field>` y el envío con `<v-form>`.
- `src/plugins/vuetify.js` y `src/main.js`: la misma configuración de Vuetify que el capítulo anterior.

## Cómo ejecutarlo
```bash
npm install
npm run dev
```
