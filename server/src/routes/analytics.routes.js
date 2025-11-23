import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    getCategorySummary,
    getExpensesByDateRange
} from "../controllers/analytics.controller.js";

const router = Router();

router.use(verifyJWT);
router.route("/category-summary").get(getCategorySummary);
router.route("/date-range").get(getExpensesByDateRange);

export default router;
