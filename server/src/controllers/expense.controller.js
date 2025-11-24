import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Expense } from "../models/expense.model.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

export const createExpense = asyncHandler(async (req, res) => {
    const { amount, categoryId, note } = req.body;

    if (amount === undefined || amount === null || isNaN(amount)) {
        throw new ApiError(400, "Valid amount is required.");
    }
    if (Number(amount) <= 0) {
        throw new ApiError(400, "Amount must be greater than zero.");
    }

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "Valid categoryId is required.");
    }

    const category = await Category.findOne({
        _id: categoryId,
        userId: req.user._id
    });

    if (!category) {
        throw new ApiError(404, "Invalid Category.");
    }

    if (note && typeof note !== "string") {
        throw new ApiError(400, "Note must be a string.");
    }

    const expense = await Expense.create({
        userId: req.user._id,
        amount,
        category: categoryId,
        note
    });

    return res
        .status(201)
        .json(new ApiResponse(201, expense, "Expense created successfully"));
});

export const getExpenses = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { startDate, endDate, sort } = req.query;

    const filters = { userId };

    if (startDate || endDate) {
        filters.createdAt = {};
        
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0); // Set to midnight
            filters.createdAt.$gte = start;
        }
    
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // End of day
            filters.createdAt.$lte = end;
        }
    }
    

    const sortOption = sort ? { createdAt: Number(sort) } : { createdAt: -1 };

    const expenses = await Expense.aggregate([
        { $match: filters },

        // Convert category to ObjectId if it's a string
        {
            $addFields: {
                categoryObjId: {
                    $cond: [
                        { $eq: [{ $type: "$category" }, "string"] },
                        { $toObjectId: "$category" },
                        "$category"
                    ]
                }
            }
        },

        // Lookup category name
        {
            $lookup: {
                from: "categories",
                localField: "categoryObjId",
                foreignField: "_id",
                as: "categoryData"
            }
        },

        { $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: true } },

        // Add categoryName field
        {
            $addFields: {
                categoryName: "$categoryData.name"
            }
        },

        // Optionally project only necessary fields
        {
            $project: {
                _id: 1,
                userId: 1,
                amount: 1,
                note: 1,
                createdAt: 1,
                updatedAt: 1,
                category: 1,
                categoryName: 1
            }
        },

        { $sort: sortOption }
    ]);

    return res.status(200).json(
        new ApiResponse(200, expenses, "Expenses with categoryName fetched successfully")
    );
});

export const getExpenseById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid expense ID");
    }

    const expense = await Expense.findOne({
        _id: id,
        userId: req.user._id
    });

    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, expense, "Expense fetched successfully"));
});

export const updateExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount, categoryId, note } = req.body;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid expense ID");
    }

    const expense = await Expense.findOne({
        _id: id,
        userId: req.user._id
    });

    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }

    // Validate amount
    if (amount !== undefined) {
        if (isNaN(amount)) {
            throw new ApiError(400, "Amount must be a valid number.");
        }
        if (Number(amount) <= 0) {
            throw new ApiError(400, "Amount must be greater than zero.");
        }
        expense.amount = amount;
    }

    if (categoryId !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new ApiError(400, "Invalid categoryId.");
        }

        const category = await Category.findOne({
            _id: categoryId,
            userId: req.user._id
        });

        if (!category) {
            throw new ApiError(404, "Invalid Category.");
        }

        expense.categoryId = categoryId;
    }

    // Validate note
    if (note !== undefined) {
        if (note !== null && typeof note !== "string") {
            throw new ApiError(400, "Note must be a string.");
        }
        expense.note = note;
    }

    await expense.save();

    return res
        .status(200)
        .json(new ApiResponse(200, expense, "Expense updated successfully"));
});

export const deleteExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid expense ID");
    }

    const deleted = await Expense.findOneAndDelete({
        _id: id,
        userId: req.user._id
    });

    if (!deleted) {
        throw new ApiError(404, "Expense not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Expense deleted successfully"));
});
