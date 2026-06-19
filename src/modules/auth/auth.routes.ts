import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.me);

router.post("/refresh", (_req, res) =>
    res.status(501).json({ error: "No implementado" }),
);
router.post("/change-password", authenticate, (_req, res) =>
    res.status(501).json({ error: "No implementado" }),
);

export default router;
