# PrimeVue: instalación y configuración (Vue 3 + Vite)

Ejemplo del capítulo 21, **"Instalación y Configuración de PrimeVue"**, del libro [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa/main/vue/c21_primevue.html). Muestra cómo integrar PrimeVue con tema Aura, Tailwind CSS, PrimeIcons y auto-import de componentes en un proyecto Vite.

## Qué repasar antes
- Haber creado un proyecto base con Vite + Vue 3.
- Conocer los pasos de instalación de dependencias (`primevue`, `@primeuix/themes`, `primeicons`, `tailwindcss` y `@tailwindcss/vite` y, como dependencias de desarrollo, `@primevue/auto-import-resolver` y `unplugin-vue-components`).
- Vue Router y Pinia (capítulo 20), que el ejemplo integra con PrimeVue.
- Node.js 18+ y un gestor de paquetes (`npm`, `pnpm`, `yarn`).

## Qué incluye el ejemplo
- Configuración del tema Aura y uso de Tailwind CSS para maquetar.
- Auto-import de componentes para evitar registros manuales.
- Vistas `Home` y `About` con Vue Router, un store de Pinia y notificaciones con `ToastService`.

## Cómo ejecutar
```bash
npm install
npm run dev
```

Abre `http://localhost:5173` y revisa `src/main.js` y `vite.config.js` para ver la configuración mínima de PrimeVue.
