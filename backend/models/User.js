const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true, //username đã tồn tại
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    token: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

