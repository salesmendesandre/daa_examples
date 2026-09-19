# Desarrollo de Aplicaciones Avanzadas (DAA) — Código de Ejemplos Prácticos

Repositorio oficial de ejemplos prácticos y proyectos de código de la asignatura **Desarrollo de Aplicaciones Avanzadas (DAA)** (Grado en Ingeniería Informática, Universidad de Salamanca).

Este repositorio acompaña al libro interactivo de la asignatura:
📖 **Libro de la asignatura:** [https://salesmendesandre.github.io/daa/](https://salesmendesandre.github.io/daa/)

> Este repositorio se va ampliando **semana a semana**, según avanza el curso: solo contiene el código de los capítulos ya impartidos en clase.

---

## 📑 Estructura del Repositorio

El código está organizado de forma modular, con un proyecto independiente por cada capítulo temático:

| Carpeta | Capítulo | Tecnologías Principales |
| :--- | :--- | :--- |
| [`00_fundamentos_javascript/`](./00_fundamentos_javascript/) | Fundamentos de JavaScript | ES6+, Métodos funcionales, `async`/`await`, Closures, Memory Store |
| [`01_fundamentos_express_ts/`](./01_fundamentos_express_ts/) | 1. Fundamentos de APIs y Express 5 | Express 5, TypeScript, Tipado estricto, TSX, CRUD en memoria |
| [`02_diseno_rest_arquitectura/`](./02_diseno_rest_arquitectura/) | 2. Diseño REST y Arquitectura en Capas | Routers, Controllers, Services, In-Memory Repository, Separación de responsabilidades |
| [`05_persistencia_mongodb_mongoose/`](./05_persistencia_mongodb_mongoose/) | 3. Persistencia con MongoDB y Mongoose | MongoDB, Mongoose, Esquemas tipados, Conexión a base de datos, CRUD persistente |

---

## 🚀 Requisitos Previos e Instalación

### Requisitos
- **Node.js**: Versión 20.x LTS o superior (recomendado 22.x o 24.x).
- **npm**: Versión 10.x o superior.

### Instalación de dependencias

El repositorio utiliza **npm workspaces**, lo que permite instalar todas las dependencias de todos los capítulos con un solo comando en la raíz:

```bash
# Desde la raíz de daa_examples/
npm install
```

O bien, puedes entrar directamente a cualquier capítulo y trabajar de manera independiente:

```bash
cd 01_fundamentos_express_ts
npm install
npm run dev
```

---

## 🛠️ Comandos Globales

Desde la raíz de `daa_examples/`:

- **Verificar tipado TypeScript en todos los proyectos:**
  ```bash
  npm run typecheck
  ```
- **Ejecutar todos los tests:**
  ```bash
  npm run test
  ```
- **Compilar todos los proyectos a JavaScript (`dist/`):**
  ```bash
  npm run build
  ```

---

## 👥 Autores y Docencia

- **André Filipe Sales Mendes** (<andremendes@usal.es> / [GitHub](https://github.com/salesmendesandre)) — Universidad de Salamanca
- **Miguel Puch Paíno** (<mpuchpaino@usal.es> / [GitHub](https://github.com/MiguelPuch)) — Universidad de Salamanca
