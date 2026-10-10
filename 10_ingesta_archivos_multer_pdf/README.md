# 10 · Ingesta de Archivos con Multer y PDF

Proyecto de apoyo al capítulo **"Ingesta de Archivos con Multer y Procesamiento de PDF"**.
Scaffold igual al del resto de capítulos: `src/server.ts` como punto de entrada,
`src/app.ts` con la configuración de Express. Swagger UI en
`http://localhost:3010/api/docs` (permite adjuntar el PDF con "Choose File").

Este proyecto mezcla en el mismo `src/` dos cosas distintas:

- **CONTENIDO** de la sesión (dominio `Documents`, `/api/documents`): Multer con
  `memoryStorage`, validación de `fileFilter` por mimetype y extracción de texto con
  `pdf-parse`.
- **EJERCICIOS ya resueltos** (dominio `Resumes`, `/api/resumes`), sobre el mismo patrón
  arquitectónico que `Documents`:
  - **Ejercicio 1** — `verifyPdfMagicBytes`: tras Multer, comprueba la firma binaria real
    del fichero (`%PDF-`) con `isRealPdfBuffer` (CONTENIDO) y lanza
    `CorruptedOrSpoofedFileError` (400) si no coincide — el `fileFilter` de Multer solo
    mira el `mimetype` que *declara* el cliente, que es falsificable.
  - **Ejercicio 2** — `uploadAttachments`: `.array("attachments", 3)`, hasta 3 PDFs de 3 MB
    cada uno en la misma petición; `verifyPdfMagicBytes` comprueba que **todos** los
    adjuntos son PDFs legítimos, no solo el primero.
  - **Ejercicio 3** — `UploadCvSchema` (Zod) convierte el campo de texto `skills`
    (`"TypeScript,Node,Docker"`) en `string[]`, y `extractSkillsFromResumeText` calcula qué
    skills aparecen en el texto del CV y el porcentaje de afinidad (`matchScore`).

## Estructura

```
src/
├── server.ts                     → arranque (calienta pdf-parse + app.listen)
├── app.ts                        → montaje de rutas (/api/documents y /api/resumes) + Swagger + manejador de errores
├── config/
│   ├── multer.ts                 → CONTENIDO: uploadPdf (memoryStorage, 5 MB, 1 archivo)
│   └── multerAttachments.ts      → EJERCICIO 2: uploadAttachments (memoryStorage, 3 MB, hasta 3 archivos)
├── controllers/
│   ├── documents.controller.ts   → CONTENIDO: POST /documents/upload
│   └── resumes.controller.ts     → EJERCICIOS: POST /resumes/upload-cv y /resumes/upload-attachments
├── errors/
│   ├── app.error.ts              → HEREDADO: clase base AppError
│   └── upload.errors.ts          → MissingFile, InvalidFileType, PdfProcessing (CONTENIDO) + CorruptedOrSpoofedFile (EJERCICIO 1)
├── middlewares/
│   ├── error.middleware.ts       → HEREDADO: notFoundHandler + globalErrorHandler (incluye MulterError -> 400)
│   ├── validate.middleware.ts    → HEREDADO: validateBody genérico y reutilizable (Zod)
│   └── verifyPdfMagicBytes.ts    → EJERCICIO 1: comprueba la firma binaria real del PDF
├── routes/
│   ├── documents.routes.ts       → CONTENIDO: /api/documents/upload
│   └── resumes.routes.ts         → EJERCICIOS: /api/resumes/upload-cv y /upload-attachments
├── schemas/
│   └── resume.schema.ts          → EJERCICIO 3: UploadCvSchema (convierte "skills" a string[])
├── services/
│   ├── pdf.service.ts            → CONTENIDO: isRealPdfBuffer (Magic Bytes) + extractTextFromPdfBuffer
│   └── skills.service.ts         → EJERCICIO 3: extractSkillsFromResumeText (afinidad de skills)
└── types/
    ├── pdf.types.ts              → CONTENIDO: PdfExtractionResult
    └── resume.types.ts           → EJERCICIOS: SkillsMatchResult, UploadedFileInfo
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

## Ejecución

```bash
npm install
npm run dev         # tsx watch src/server.ts -> http://localhost:3010
npm run typecheck
npm run build && npm start
```

## Probar en directo

Genera un PDF mínimo y válido en segundos a partir de un PDF en Base64 (el mismo que usa
`warmupPdfParser` para calentar `pdf-parse` al arrancar); lo reutilizamos como "CV" de prueba:

```bash
node -e "require('fs').writeFileSync('cv.pdf', Buffer.from('JVBERi0xLjMKJf////8KNyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDYgMCBSCi9Vc2VyVW5pdCAxCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRm9udCA8PAovRjEgOCAwIFIKPj4KL0NvbG9yU3BhY2UgPDwKPj4KPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCAxODEKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnicZY47TgRBEEPzPoUvsFCfLteONJoACQIypM4QAVq6sw24f4Jq+SQkJfnZclkhEJwUgtwMl2v7bPqPPYwfqEhDqt75uWNc2/2TQg1jtde9dy56Bj8YnNm5TNgZJilpB04a2DMYNGpBamEV7KV5qRvOKlDOUh42D1Cwm3TnutUGJzd+1+dNxV89N3oZWWFLq+99ctWOA5Wwyfd0k9xMeuS5tjHS03/9A/KG8dweR3tpX8mEPT8KZW5kc3RyZWFtCmVuZG9iagoxMCAwIG9iagooUERGS2l0KQplbmRvYmoKMTEgMCBvYmoKKFBERktpdCkKZW5kb2JqCjEyIDAgb2JqCihEOjIwMjYwOTA2MTQzNjM0WikKZW5kb2JqCjkgMCBvYmoKPDwKL1Byb2R1Y2VyIDEwIDAgUgovQ3JlYXRvciAxMSAwIFIKL0NyZWF0aW9uRGF0ZSAxMiAwIFIKPj4KZW5kb2JqCjggMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9IZWx2ZXRpY2EKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iago0IDAgb2JqCjw8Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgovTmFtZXMgMiAwIFIKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs3IDAgUl0KPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Rlc3RzIDw8CiAgL05hbWVzIFsKXQo+Pgo+PgplbmRvYmoKeHJlZgowIDEzCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDgzMiAwMDAwMCBuIAowMDAwMDAwODg5IDAwMDAwIG4gCjAwMDAwMDA3NzAgMDAwMDAgbiAKMDAwMDAwMDc0OSAwMDAwMCBuIAowMDAwMDAwMjM4IDAwMDAwIG4gCjAwMDAwMDAxMzEgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwNjUyIDAwMDAwIG4gCjAwMDAwMDA1NzcgMDAwMDAgbiAKMDAwMDAwMDQ5MSAwMDAwMCBuIAowMDAwMDAwNTE2IDAwMDAwIG4gCjAwMDAwMDA1NDEgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSAxMwovUm9vdCAzIDAgUgovSW5mbyA5IDAgUgovSUQgWzw3OThlYzFkYWRmZDgyOTUzNjIxMzdkYzBkMjYyYWUwZT4gPDc5OGVjMWRhZGZkODI5NTM2MjEzN2RjMGQyNjJhZTBlPl0KPj4Kc3RhcnR4cmVmCjkzNgolJUVPRgo=', 'base64'))"
echo "esto no es un pdf, aunque diga serlo" > falso.pdf
```

```bash
# --- Documents (CONTENIDO) ---

# PDF válido -> 201 (extrae el texto y lo devuelve en "preview")
curl -X POST http://localhost:3010/api/documents/upload -F "file=@cv.pdf;type=application/pdf"

# Sin archivo -> 400 (MissingFile)
curl -i -X POST http://localhost:3010/api/documents/upload

# Archivo que no es PDF (mimetype incorrecto) -> 400 (InvalidFileType)
curl -i -X POST http://localhost:3010/api/documents/upload -F "file=@falso.pdf;type=text/plain"
```

```bash
# --- Resumes (EJERCICIOS) ---

# Ej.1 y Ej.3 — CV válido -> 201 (firma binaria OK, skills por defecto)
curl -X POST http://localhost:3010/api/resumes/upload-cv -F "cv=@cv.pdf;type=application/pdf"

# Ej.3 — Lista de skills explícita -> calcula matchScore contra el texto del PDF
curl -X POST http://localhost:3010/api/resumes/upload-cv \
  -F "cv=@cv.pdf;type=application/pdf" \
  -F "skills=TypeScript,Node,Docker,Python,Java"

# Ej.1 — Fichero que DICE ser un PDF (extensión .pdf y mimetype application/pdf)
# pero cuyos bytes reales no empiezan por "%PDF-" -> 400 (CorruptedOrSpoofedFile)
curl -i -X POST http://localhost:3010/api/resumes/upload-cv -F "cv=@falso.pdf;type=application/pdf;filename=cv-falso.pdf"

# Ej.2 — Hasta 3 adjuntos en el mismo campo "attachments" -> 201
curl -X POST http://localhost:3010/api/resumes/upload-attachments \
  -F "attachments=@cv.pdf;type=application/pdf" \
  -F "attachments=@cv.pdf;type=application/pdf"

# Ej.2 — Un cuarto adjunto supera el límite de Multer -> 400 (LIMIT_UNEXPECTED_FILE)
curl -i -X POST http://localhost:3010/api/resumes/upload-attachments \
  -F "attachments=@cv.pdf;type=application/pdf" -F "attachments=@cv.pdf;type=application/pdf" \
  -F "attachments=@cv.pdf;type=application/pdf" -F "attachments=@cv.pdf;type=application/pdf"
```

## Otras notas

- `npm audit` puede avisar de que `multer@1.x` está deprecado en favor de `2.x` — la versión
  instalada (`1.4.5-lts.2`) es el parche de seguridad vigente de la rama 1.x, sin CVE abierto
  según `npm audit`.
