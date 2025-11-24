import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import { Expense } from "../models/expense.model.js";
import mongoose from "mongoose";

export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const trimmedName = name?.trim();

    if (!trimmedName) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Category name is required"));
    }

    // Check for duplicate for this user
    const existing = await Category.findOne({
        userId: req.user._id,
        name: trimmedName
    });

    if (existing) {
        return res
            .status(200) // Return 200 with ApiResponse to avoid MongoDB duplicate error
            .json(new ApiResponse(200, existing, "Category already exists"));
    }

    const category = await Category.create({
        userId: req.user._id,
        name: trimmedName
    });

    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully"));
});

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ userId: req.user._id }).sort({
        name: 1
    });

    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

export const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Invalid category ID"));
    }

    const category = await Category.findOne({
        _id: id,
        userId: req.user._id
    });

    if (!category) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Category not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category fetched successfully"));
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const trimmedName = req.body.name?.trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Invalid category ID"));
    }

    if (!trimmedName) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Category name is required"));
    }

    const duplicate = await Category.findOne({
        userId: req.user._id,
        name: trimmedName,
        _id: { $ne: id }
    });

    if (duplicate) {
        return res
            .status(200)
            .json(new ApiResponse(200, duplicate, "Another category with this name already exists"));
    }

    const updated = await Category.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { name: trimmedName },
        { new: true }
    );

    if (!updated) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Category not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Category updated successfully"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Invalid category ID"));
    }

    const usedInExpenses = await Expense.findOne({ category: id });

    if (usedInExpenses) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Category is currently used in expenses. Reassign or delete those expenses first."
                )
            );
    }

    const deleted = await Category.findOneAndDelete({
        _id: id,
        userId: req.user._id
    });

    if (!deleted) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Category not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Category deleted successfully"));
});
