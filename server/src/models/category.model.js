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
        },
    },
    {
        timestamps: true
    }
);

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = mongoose.model("Category", categorySchema);
