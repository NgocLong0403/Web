const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

//resetpassword
// const passwordReset = require("./routes/passwordReset");
// const users = require("./routes/users");

dotenv.config();
const app = express();


mongoose.connect(process.env.MONGODB_URL, () => {
    console.log("CONNECTED TO MONGO DB");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);

//resetpassword
// app.use("/v1/auth/password-reset", passwordReset);

app.listen(8000, () => {
    console.log("Server is running...");
});

//AUTHENTICATION
//AUTHORIZATION
//JSON WEB TOKEN