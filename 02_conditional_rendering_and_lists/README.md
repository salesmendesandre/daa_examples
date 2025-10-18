

# 02. Renderizado Condicional y Listas en React

Este proyecto contiene ejemplos básicos de componentes en React, diseñados para ilustrar conceptos fundamentales del desarrollo de aplicaciones web modernas.

## 📚 Material de Apoyo

<img src="https://salesmendesandre.github.io/daa_book/main/_static/cover.png" width="300"/>
Este repositorio es material complementario del libro: [Desarrollo de Aplicaciones Avanzadas](https://salesmendesandre.github.io/daa_book/)




## 🎯 Conceptos Ilustrados

Renderizado condicional y listas en React

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
02_conditional_rendering_and_lists/
├── src/
│   ├── components/
│   │   ├── EssentialGearList.jsx
│   │   ├── MessageListItem.jsx
│   │   ├── OptionalGearItem.jsx
│   │   ├── PanelistList.jsx
│   │   ├── RecipeIngredient.jsx
│   │   ├── ReadingListItem.jsx
│   │   ├── WorkshopList.jsx
│   ├── data/
│   │   ├── panelists.js
│   │   ├── workshops.js
│   ├── index.css
│   ├── main.jsx
├── index.html
├── package.json
├── vite.config.js
``` 
## 💡 Aprendiendo de los Ejemplos

A través de estos ejemplos, puedes aprender a:
1. Omitir contenido devolviendo `null`
2. Incluir o excluir JSX desde el componente padre
3. Asignar JSX a una variable temporal
4. Usar el operador ternario `? :` para reducir duplicación
5. Transformar arreglos con `map`
6. Filtrar colecciones antes de renderizar  
Cada componente está diseñado para ser simple y fácil de entender, facilitando el aprendizaje de los conceptos clave de React relacionados con el renderizado condicional y la gestión de listas.

## Recursos y lecturas recomendadas

- [Documentación oficial de React: Renderizado condicional](https://react.dev/learn/conditional-rendering)
- [Documentación oficial de React: Renderizado de listas](https://react.dev/learn/rendering-lists)
- [Robin Wieruch: Conditional Rendering in React](https://www.robinwieruch.de/conditional-rendering-react/)
- [Robin Wieruch: React List Key](https://www.robinwieruch.de/react-list-key/)