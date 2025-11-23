import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import { Expense } from "../models/expense.model.js";
import mongoose from "mongoose";

export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
        throw new ApiError(400, "Category name is required");
    }    

    const existing = await Category.findOne({
        userId: req.user._id,
        name: name.trim()
    });

    if (existing) {
        throw new ApiError(409, "Category with this name already exists");
    }

    const category = await Category.create({
        userId: req.user._id,
        name: name.trim()
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
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findOne({
        _id: id,
        userId: req.user._id
    });

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category fetched successfully"));
});


export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category ID");
    }

    if (!name || name.trim().length === 0) {
        throw new ApiError(400, "Category name is required");
    }

    const duplicate = await Category.findOne({
        userId: req.user._id,
        name: name.trim(),
        _id: { $ne: id }
    });

    if (duplicate) {
        throw new ApiError(409, "Another category with this name already exists");
    }

    const updated = await Category.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { name: name.trim() },
        { new: true }
    );

    if (!updated) {
        throw new ApiError(404, "Category not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Category updated successfully"));
});


export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const usedInExpenses = await Expense.findOne({ categoryId: id });

    if (usedInExpenses) {
        throw new ApiError(
            400,
            "Category is currently used in expenses. Reassign or delete those expenses first."
        );
    }

    const deleted = await Category.findOneAndDelete({
        _id: id,
        userId: req.user._id
    });

    if (!deleted) {
        throw new ApiError(404, "Category not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Category deleted successfully"));
});
