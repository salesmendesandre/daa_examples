import multer from "multer";

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("text/")) {
      cb(null, true);
    } else {
      // statusCode 415 (Unsupported Media Type): el manejador global de errores lo respeta.
      cb(Object.assign(new Error("Solo se admiten documentos PDF o ficheros de texto"), { statusCode: 415 }));
    }
  }
});
