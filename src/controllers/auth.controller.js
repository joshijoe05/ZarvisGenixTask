const Joi = require("joi");
const bcrypt = require("bcryptjs");
const User = require("../models/users.model");
const { signToken, verifyToken } = require("../helper/jwt.helper");


const handleRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userValidation = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = userValidation.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: false,
                message: "Invalid details"
            });
        }

        const userExists = await User.findOne({ email }).select("email -_id");

        if (userExists) {
            res.status(400).json({
                status: false,
                message: "User already exists with the given email"
            });
        } else {
            const encryptedPassword = await bcrypt.hash(password, 10);
            await User.create({
                name,
                email,
                password: encryptedPassword,
            });
            res.status(200)
                .json({
                    status: true,
                    message: "Account Created, Login to continue",
                });
        }
    }
    catch (e) {
        return res.status(500).json({
            status: false,
            message: e.message
        });
    }
}

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userValidation = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = userValidation.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: false,
                message: "Invalid details"
            });
        }

        const user = await User.findOne({
            email,
        }).select("+email +name");


        if (!user) {
            return res.status(400).json({
                status: false,
                message: "Invalid Credentials"
            });
        }
        else {
            const isValidPassword = await bcrypt.compare(
                password,
                user.password,
            );
            if (isValidPassword) {
                const jwtToken = signToken({
                    userId: user._id,
                    email: user.email
                });
                return res.status(200).json({
                    status: true,
                    message: "Login Successful",
                    jwtToken,
                    name: user.name,
                    email: user.email
                });
            }
            else {
                return res.status(400).json({
                    status: false,
                    message: "Invalid Credentials"
                });
            }
        }
    }
    catch (e) {
        return res.status(500).json({
            status: false,
            message: e.message
        });
    }
}

const handleGetUserData = async (req, res) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const verifiedToken = verifyToken(token);
            if (!verifiedToken) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid token"
                });
            }
            const user = await User.findOne({ email: verifiedToken.email });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "Not Authorized"
                });
            }
            return res.status(200).json({
                status: true,
                message: "Valid token",
                name: user.name,
                email: user.email
            });
        }
        else {
            return res.status(400).json({
                status: false,
                message: "Not Authorized"
            });
        }


    }
    catch (e) {
        return res.status(500).json({
            status: false,
            message: e.message
        });
    }
}

module.exports = { handleRegister, handleLogin, handleGetUserData };