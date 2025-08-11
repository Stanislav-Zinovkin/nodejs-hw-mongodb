import express from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserController } from "../controllers/userController.js";
import { registerUserSchema, loginUserSchema, sendResetEmailSchema } from "../schemas/authSchema.js";
import { refreshSessionController, loginUserController, logoutUserController, sendResetEmailController, resetPasswordController } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerUserController));
router.post("/logout", ctrlWrapper(logoutUserController));
router.post('/refresh', ctrlWrapper(refreshSessionController));
router.post('/send-reset-email', validateBody(sendResetEmailSchema), ctrlWrapper(sendResetEmailController));
router.post('/reset-password', resetPasswordController);
export default router;