import { Router } from "express";
import {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense
} from "../controllers/expense.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/").post(createExpense)
    .get(getExpenses);
router.route("/:id").get(getExpenseById)
    .put(updateExpense)
    .delete(deleteExpense);

export default router;
