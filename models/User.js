const mongoose, { Schema } = require("mongoose")

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema)