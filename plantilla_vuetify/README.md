# Plantilla de Vuetify con navegación

Proyecto base para empezar una aplicación con **Vue 3, Vuetify 4 y Vue Router 5**. No pertenece a ningún capítulo concreto: sirve como punto de partida para las prácticas.

## Qué incluye
- **Menú arriba** (`v-app-bar`) con dos rutas: Inicio (`/`) y Contacto (`/contacto`).
- **Navegación adaptable** con `useDisplay()` de Vuetify:
  - En PC (960 px o más), los enlaces son botones en la propia barra.
  - En móvil y tableta pequeña (`smAndDown`), la barra muestra el icono de menú y los enlaces van en un menú lateral (`v-navigation-drawer`) que se cierra al elegir una opción.
- **Vistas que se reorganizan según el ancho** con la rejilla de Vuetify (`v-row` y `v-col`):
  - Inicio: 3 tarjetas por fila en PC (`md="4"`), 2 en tableta (`sm="6"`) y 1 en móvil (`cols="12"`). Un `v-chip` muestra el punto de corte actual (`xs`, `sm`, `md`…).
  - Contacto: nombre y correo en dos columnas en PC y uno debajo de otro en móvil; el botón ocupa todo el ancho en móvil (`:block="movil"`).

## Estructura

```text
plantilla_vuetify/
└── src/
    ├── plugins/vuetify.js   # createVuetify con el tema
    ├── router/index.js      # las dos rutas
    ├── views/
    │   ├── InicioView.vue
    │   └── ContactoView.vue
    ├── App.vue              # barra, menú lateral y <RouterView>
    └── main.js
```

## Cómo ejecutar

```bash
cd plantilla_vuetify
npm install
npm run dev
```

Abre `http://localhost:5173` y cambia el ancho de la ventana, o usa el modo de dispositivo móvil de las herramientas de desarrollo del navegador, para ver cómo cambian el menú y las vistas.

## Cómo ampliarla
- **Nueva página:** crear la vista en `src/views/`, añadir su ruta en `src/router/index.js` y un elemento en `ENLACES` de `App.vue`. El enlace aparece a la vez en la barra y en el menú lateral.
- **Colores:** se cambian en el tema de `src/plugins/vuetify.js`.
