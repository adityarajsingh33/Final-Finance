import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Expense } from "../models/expense.model.js";
import mongoose from "mongoose";
import { Category } from "../models/category.model.js";

export const getCategorySummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const summary = await Category.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },

    {
      $lookup: {
        from: "expenses",
        let: { categoryId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$category", "$$categoryId"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] }
                ]
              }
            }
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              expenseCount: { $sum: 1 }
            }
          }
        ],
        as: "expenseData"
      }
    },

    {
      $unwind: {
        path: "$expenseData",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $project: {
        categoryId: "$_id",
        categoryName: "$name",
        totalAmount: { $ifNull: ["$expenseData.totalAmount", 0] },
        expenseCount: { $ifNull: ["$expenseData.expenseCount", 0] },
        _id: 0
      }
    }
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, summary, "Category summary fetched successfully")
    );
});

export const getExpensesByDateRange = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { startDate, endDate } = req.query;
  
    if (!startDate || !endDate) {
      throw new ApiError(400, "Start date and end date are required");
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  
    const data = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalAmount: { $sum: "$amount" },
          expenseCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalAmount: { $ifNull: ["$totalAmount", 0] },
          expenseCount: { $ifNull: ["$expenseCount", 0] },
        },
      },
    ]);
  
    return res
      .status(200)
      .json(
        new ApiResponse(200, data, "Expenses by date range fetched successfully")
      );
  });
  