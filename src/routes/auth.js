import express from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserController } from "../controllers/userController.js";
import { registerUserSchema } from "../schemas/authSchema.js";
import { refreshSessionController } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerUserController));
router.post('/refresh', ctrlWrapper(refreshSessionController));
export default router;