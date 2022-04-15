const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        is_deleted: {
            type: Boolean,
            required: false,
            default: false,
        },
        deleted_timestamp: {
            type: Date,
            required: false,
        },
        role: {
            type: String,
            enum: ["re.admin", "re.user"],
            default: "re.user",
        },
        auth_type: {
            type: String,
            required: true,
            enum: ["normal", "google", "facebook"],
        },
        profile_url: {
            type: String,
            default: "",
            required: false,
        },
        is_admin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("users", UserSchema);
