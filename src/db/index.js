const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const DB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${DB_URI}/${DB_NAME}`);
        console.log(`MONGO DB Connected, HOST : ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.log(`MONGODB CONNECTION FAILED ${error}`);
        process.exit(1);
    }
}

module.exports = connectDB;