require("dotenv").config({ path: "./.env" })
const express = require("express");
const connectDB = require("./src/db/index");

const app = express();
app.use(express.json({ limit: "16kb" }));


// routes
const authRoute = require("./src/routes/auth.route");
app.use("/api/auth", authRoute);



connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started and listening to port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(`MONGODB CONNECTION FAILED`);
});