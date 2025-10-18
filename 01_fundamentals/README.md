# 01 - Fundamentos de React

<img src="https://salesmendesandre.github.io/daa_book/main/_static/cover.png" width="300"/>

Este proyecto contiene ejemplos básicos de componentes en React, diseñados para ilustrar conceptos fundamentales del desarrollo de aplicaciones web modernas.

## 📚 Material de Apoyo

Este repositorio es material complementario del libro: [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa_book/)

## 🎯 Conceptos Ilustrados

### 1. Estado Local con `useState`
- **ClickCounter**: Componente simple que demuestra el uso del hook `useState` para gestionar el estado local de un contador.

### 2. Props (Propiedades)
- **Reminder**: Componente que recibe propiedades (`task` y `deadline`) para mostrar recordatorios.
- **Dashboard**: Componente padre que renderiza múltiples instancias de `Reminder` con diferentes props.

### 3. Callbacks y Comunicación Padre-Hijo
- **ReminderWithAck**: Componente que recibe un callback (`onComplete`) para comunicarse con su componente padre.
- **DashboardWithCallback**: Componente padre que maneja eventos de sus componentes hijos mediante callbacks.

### 4. Composición de Componentes
- **ClickDashboard**: Ejemplo de composición de múltiples componentes en una única vista.

## 🚀 Instalación y Ejecución

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```

### Build para Producción
```bash
npm run build
```

### Preview del Build
```bash
npm run preview
```

## 🛠️ Tecnologías

- **React 19.1.1**: Biblioteca para construir interfaces de usuario
- **Vite 7.1.7**: Herramienta de construcción rápida
- **ESLint**: Linter para mantener calidad de código

## 📁 Estructura del Proyecto

```
01_fundamentals/
├── src/
│   ├── components/
│   │   ├── ClickCounter.jsx
│   │   ├── ClickDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DashboardWithCallback.jsx
│   │   ├── Reminder.jsx
│   │   └── ReminderWithAck.jsx
│   ├── App.css
│   └── main.jsx
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## 💡 Aprendiendo de los Ejemplos

Cada componente está diseñado para ser simple y fácil de entender:

1. **Comienza con `ClickCounter`**: El ejemplo más básico de estado en React
2. **Explora `Reminder` y `Dashboard`**: Aprende sobre props y composición
3. **Avanza a `DashboardWithCallback`**: Entiende la comunicación entre componentes

## 📖 Recursos Adicionales

- [Documentación oficial de React](https://react.dev/)
- [Guía de Vite](https://vitejs.dev/)
- [Libro DAA](https://salesmendesandre.github.io/daa_book/)