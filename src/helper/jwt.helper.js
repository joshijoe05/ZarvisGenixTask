const jwt = require("jsonwebtoken");

const signToken = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_KEY);
        return token;
    }
    catch (e) {
        return error.message;
    }
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        return null;
    }
};

module.exports = { signToken, verifyToken };