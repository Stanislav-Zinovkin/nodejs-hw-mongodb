import express from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserController } from "../controllers/userController.js";
import { registerUserSchema } from "../schemas/authSchema.js";

const router = express.Router();

router.post("/register" , validateBody(registerUserSchema), ctrlWrapper(registerUserController));

export default router;