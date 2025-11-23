import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
    },
    {
        timestamps: true
    }
);


export const Category = mongoose.model("Category", categorySchema);
