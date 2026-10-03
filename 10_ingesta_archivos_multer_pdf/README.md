# 10 · Ingesta de Archivos con Multer y PDF

Proyecto de apoyo al capítulo **"Ingesta de Archivos con Multer y Procesamiento de PDF"**.
Scaffold igual al del resto de capítulos: `src/server.ts` como punto de entrada,
`src/app.ts` con la configuración de Express. Swagger UI en
`http://localhost:3010/api/docs` (permite adjuntar el PDF con "Choose File").

## Estructura

```
src/
├── server.ts                  → arranque (calienta pdf-parse + app.listen)
├── app.ts                     → montaje de rutas + Swagger + manejador de errores
├── config/
│   └── multer.ts              → uploadPdf: memoryStorage, 5 MB, 1 archivo
├── controllers/
│   └── documents.controller.ts → POST /documents/upload
├── errors/
│   ├── app.error.ts           → clase base AppError (ver capítulo de validación)
│   └── upload.errors.ts       → MissingFile, InvalidFileType, PdfProcessing
├── middlewares/
│   ├── error.middleware.ts    → notFoundHandler + globalErrorHandler (incluye MulterError -> 400)
│   └── validate.middleware.ts → validateBody genérico y reutilizable (Zod)
├── routes/
│   └── documents.routes.ts    → /api/documents/upload
├── services/
│   └── pdf.service.ts         → isRealPdfBuffer (Magic Bytes) + extractTextFromPdfBuffer
└── types/
    └── pdf.types.ts           → PdfExtractionResult
```

Todas las respuestas de error siguen el formato de los capítulos anteriores:
`{ "status": "fail", "error": "<Nombre>", "message": "..." }`.

## Nota: `pdf-parse` falla de forma intermitente al arrancar

`pdf-parse` (basado en una versión antigua de pdf.js) puede fallar con "bad XRef entry" en las
primeras llamadas de un proceso Node recién arrancado, incluso con un PDF perfectamente válido
— es un problema de inicialización interna de la propia librería. Por eso `server.ts` llama a
`warmupPdfParser()` (parsea un PDF mínimo embebido varias veces, ignorando errores) **antes** de
`app.listen`, y `extractTextFromPdfBuffer()` reintenta internamente como red de seguridad
adicional. Nunca uses un PDF "de mentira" escrito a mano para probar — `pdf-parse` lo rechaza
siempre; usa un PDF real (ver más abajo cómo generar uno mínimo de prueba).

> Este capítulo aún no incluye ejercicios resueltos en este repositorio — se añadirán más
> adelante, una vez corregidos en clase.

## Ejecución

```bash
npm install
npm run dev         # tsx watch src/server.ts -> http://localhost:3010
npm run typecheck
npm run build && npm start
```

## Probar en directo

Este capítulo no incluye todavía PDFs de ejemplo en el repositorio. Puedes generar uno mínimo
y válido en segundos a partir de un PDF en Base64 (el mismo que usa `warmupPdfParser` para
calentar `pdf-parse` al arrancar):

```bash
node -e "require('fs').writeFileSync('sample.pdf', Buffer.from('JVBERi0xLjMKJf////8KNyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDYgMCBSCi9Vc2VyVW5pdCAxCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRm9udCA8PAovRjEgOCAwIFIKPj4KL0NvbG9yU3BhY2UgPDwKPj4KPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCAxODEKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnicZY47TgRBEEPzPoUvsFCfLteONJoACQIypM4QAVq6sw24f4Jq+SQkJfnZclkhEJwUgtwMl2v7bPqPPYwfqEhDqt75uWNc2/2TQg1jtde9dy56Bj8YnNm5TNgZJilpB04a2DMYNGpBamEV7KV5qRvOKlDOUh42D1Cwm3TnutUGJzd+1+dNxV89N3oZWWFLq+99ctWOA5Wwyfd0k9xMeuS5tjHS03/9A/KG8dweR3tpX8mEPT8KZW5kc3RyZWFtCmVuZG9iagoxMCAwIG9iagooUERGS2l0KQplbmRvYmoKMTEgMCBvYmoKKFBERktpdCkKZW5kb2JqCjEyIDAgb2JqCihEOjIwMjYwOTA2MTQzNjM0WikKZW5kb2JqCjkgMCBvYmoKPDwKL1Byb2R1Y2VyIDEwIDAgUgovQ3JlYXRvciAxMSAwIFIKL0NyZWF0aW9uRGF0ZSAxMiAwIFIKPj4KZW5kb2JqCjggMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9IZWx2ZXRpY2EKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iago0IDAgb2JqCjw8Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgovTmFtZXMgMiAwIFIKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs3IDAgUl0KPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Rlc3RzIDw8CiAgL05hbWVzIFsKXQo+Pgo+PgplbmRvYmoKeHJlZgowIDEzCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDgzMiAwMDAwMCBuIAowMDAwMDAwODg5IDAwMDAwIG4gCjAwMDAwMDA3NzAgMDAwMDAgbiAKMDAwMDAwMDc0OSAwMDAwMCBuIAowMDAwMDAwMjM4IDAwMDAwIG4gCjAwMDAwMDAxMzEgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwNjUyIDAwMDAwIG4gCjAwMDAwMDA1NzcgMDAwMDAgbiAKMDAwMDAwMDQ5MSAwMDAwMCBuIAowMDAwMDAwNTE2IDAwMDAwIG4gCjAwMDAwMDA1NDEgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSAxMwovUm9vdCAzIDAgUgovSW5mbyA5IDAgUgovSUQgWzw3OThlYzFkYWRmZDgyOTUzNjIxMzdkYzBkMjYyYWUwZT4gPDc5OGVjMWRhZGZkODI5NTM2MjEzN2RjMGQyNjJhZTBlPl0KPj4Kc3RhcnR4cmVmCjkzNgolJUVPRgo=', 'base64'))"
```

```bash
# PDF válido -> 201 (extrae el texto y lo devuelve en "preview")
curl -X POST http://localhost:3010/api/documents/upload -F "file=@sample.pdf;type=application/pdf"

# Sin archivo -> 400 (MissingFile)
curl -i -X POST http://localhost:3010/api/documents/upload

# Archivo que no es PDF (mimetype incorrecto) -> 400 (InvalidFileType)
echo "esto no es un pdf" > falso.txt
curl -i -X POST http://localhost:3010/api/documents/upload -F "file=@falso.txt;type=text/plain"
```

## Otras notas

- `npm audit` puede avisar de que `multer@1.x` está deprecado en favor de `2.x` — la versión
  instalada (`1.4.5-lts.2`) es el parche de seguridad vigente de la rama 1.x, sin CVE abierto
  según `npm audit`.
