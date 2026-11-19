import { Router, Request, Response, NextFunction } from "express";
import { NoteModel } from "../models/note.model.js";
import { CreateNoteSchema, UpdateNoteSchema } from "../schemas/note.schema.js";
import { validateBody } from "../middlewares/validate.middleware.js";

// CRUD público de notas: no requiere token, para poder consumirlo desde Vue
// antes del capítulo de autenticación.
const router = Router();

// Un ObjectId de MongoDB son 24 caracteres hexadecimales (ver documents.routes.ts)
const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  if (!/^[a-f\d]{24}$/i.test(String(req.params.id))) {
    return res.status(400).json({ status: "fail", error: "Identificador de nota no válido" });
  }
  next();
};

// Listado completo (sin paginar): primero las fijadas y, dentro de cada grupo, las más recientes
router.get("/", async (_req: Request, res: Response) => {
  const notes = await NoteModel.find().sort({ pinned: -1, updatedAt: -1 }).exec();
  res.json(notes);
});

router.get("/:id", validateObjectId, async (req: Request, res: Response) => {
  const note = await NoteModel.findById(req.params.id).exec();
  if (!note) return res.status(404).json({ error: "Nota no encontrada" });
  res.json(note);
});

router.post("/", validateBody(CreateNoteSchema), async (req: Request, res: Response) => {
  const note = await NoteModel.create(req.body);
  res.status(201).json(note);
});

// Actualización parcial: solo cambian los campos enviados (p. ej. { pinned: true })
router.patch("/:id", validateObjectId, validateBody(UpdateNoteSchema), async (req: Request, res: Response) => {
  const note = await NoteModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).exec();
  if (!note) return res.status(404).json({ error: "Nota no encontrada" });
  res.json(note);
});

router.delete("/:id", validateObjectId, async (req: Request, res: Response) => {
  const note = await NoteModel.findByIdAndDelete(req.params.id).exec();
  if (!note) return res.status(404).json({ error: "Nota no encontrada" });
  res.status(204).send();
});

export default router;
