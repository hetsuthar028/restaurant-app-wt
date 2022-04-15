const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories",
            required: true,
        },
        ingredients: {
            type: Object,
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        preparationTime: {
            type: Number,
            required: true,
        },
        available: {
            type: Boolean,
            required: true,
        },
        recipe: {
            type: Array,
            required: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        is_veg: {
            type: Boolean,
            required: true,
        },
        is_jain: {
            type: Boolean,
            required: true,
        },
        ratings: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("menuitems", MenuItemSchema);
