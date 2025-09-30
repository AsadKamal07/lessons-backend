import { Router } from "express";
import auth from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createSummarySchema, updateSummarySchema } from "../validators/summary.schema.js";
import { createSummary, listSummaries, updateSummary, deleteSummary } from "../controllers/summaryController.js";

const router = Router();

router.use(auth); // all routes are protected

router.post("/", validate(createSummarySchema), createSummary);
router.get("/", listSummaries);
router.put("/update/:id", validate(updateSummarySchema), updateSummary);
router.delete("/delete/:id", deleteSummary);

export default router;
