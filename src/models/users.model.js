const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is a required field"]
    },
    email: {
        type: String,
        required: [true, "Mail is required field"],
        unique: true,
        validate: {
            validator: (value) => {
                const re = /^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+/;
                return value.match(re);
            },
            message: "Invalid mail, Please enter valid email"
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password should be atleast 6 characters"]
    },
},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;