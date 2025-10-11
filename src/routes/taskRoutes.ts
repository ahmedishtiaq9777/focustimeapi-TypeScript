import express from "express";
import multer from "multer";
import * as Taskcontroller from "../controllers/taskController";
import { authenticateToken } from "../middleware/middleware";

const router = express.Router();
const upload = multer();

// middleware
router.use(authenticateToken);

router.post("/addtask2", upload.single("image"), Taskcontroller.createTask);

router.get("/tasks", Taskcontroller.getTasks);
router.get("/tasksWithsearch", Taskcontroller.getTasksWithSearchController);

router.put("/task/:id", upload.single("image"), Taskcontroller.updateTask);

// Delete task
router.delete("/tasks/:id", Taskcontroller.deleteTask);

// Get dashboard data
router.get("/getDashboardData", Taskcontroller.getDashboardData);

export default router;
