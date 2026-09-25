# 00: Fundamentos de JavaScript Moderno (ES6+)

Código de soporte correspondiente al capítulo **Fundamentos de JavaScript** del libro interactivo.
Incluye tanto el contenido explicado en clase como los ejercicios prácticos ya resueltos.

## Contenido (`src/`)

- `src/01_array_methods.js`: operaciones funcionales con `.filter()`, `.map()`, `.reduce()`.
- `src/02_asincronia.js`: manejo de Promesas, `async`/`await` y consultas concurrentes con `Promise.all()`.
- `src/03_memory_store.js`: repositorio en memoria (`ContactStore`) con operaciones CRUD simuladas.
- `src/main.js`: demostración interactiva de todos los módulos anteriores.

## Ejercicios resueltos (`src/ejercicios/`)

Soluciones completas de los 3 ejercicios propuestos en el "Taller Práctico" del capítulo:

- `ejercicio1_limpieza_usuarios.js` — `limpiarUsuarios()`: filtrado y transformación de un
  array de registros usando `.filter()`/`.map()`, `trim()` y normalización de email.
- `ejercicio2_contact_store.js` — `ContactStore`: clase con operaciones CRUD en memoria
  (`obtenerTodos`, `obtenerPorId`, `crear`, `eliminar`).
- `ejercicio3_autorizar_acceso.js` — `autorizarAcceso()`: `async`/`await` encadenado con
  `try`/`catch` para simular una consulta de usuario seguida de una verificación de permisos.
- `main.js`: ejecuta los tres ejercicios en orden con casos de prueba representativos
  (incluyendo el caso de error del ejercicio 3).

## Ejecución

```bash
npm install   # no hay dependencias externas

npm run dev     # contenido del capítulo (auto-reload)
npm start       # contenido del capítulo (una sola vez)

npm run ejercicios       # ejercicios resueltos
npm run ejercicios:dev   # ejercicios resueltos con auto-reload
```

No requiere Express ni ninguna base de datos: es JavaScript puro ejecutado con Node.js.
