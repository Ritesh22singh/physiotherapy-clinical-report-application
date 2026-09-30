const mongoose = require("mongoose");

const petientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            trim: true,

        },
        dateOfBirth: {
            type: Date
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Patient", petientSchema)