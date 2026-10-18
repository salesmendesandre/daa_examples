import { Router } from "express";
import * as coursesCtrl from "../controllers/courses.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = Router();

router.get("/", coursesCtrl.getAllCourses);
router.get("/:id", validateObjectId("id"), coursesCtrl.getCourseById);
router.post("/", coursesCtrl.createCourse);
router.delete("/:id", validateObjectId("id"), coursesCtrl.deleteCourse);

export default router;
