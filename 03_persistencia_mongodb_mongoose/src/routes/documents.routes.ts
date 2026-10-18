import { Router } from "express";
import * as docsCtrl from "../controllers/documents.controller.js";

const router = Router();

router.get("/", docsCtrl.getAllDocuments);
router.get("/:id", docsCtrl.getDocumentById);
router.post("/", docsCtrl.createDocument);
router.put("/:id", docsCtrl.updateDocument);
router.delete("/:id", docsCtrl.deleteDocument);

export default router;
