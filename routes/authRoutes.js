import { Router } from "express";
import { signup, login, updateProfile } from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { signupSchema, loginSchema, profileSchema } from "../validators/auth.schema.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.put("/updateProfile", auth, validate(profileSchema), updateProfile);

export default router;
