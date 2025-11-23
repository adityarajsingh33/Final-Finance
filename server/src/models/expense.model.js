import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        amount: {
            type: Number,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        },
        note: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export const Expense = mongoose.model("Expense", expenseSchema);
