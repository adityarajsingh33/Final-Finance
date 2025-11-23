import { Router } from "express";
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(createCategory)
    .get(getCategories);

router.route("/:id")
    .get(getCategoryById)
    .patch(updateCategory)
    .delete(deleteCategory);

export default router;
