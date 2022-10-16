const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { user, validate } = require("../models/User")
// const config = require("../config/config")

const nodemailer = require("nodemailer");
const randomstring = require("randomstring");


let refreshTokens = [];
const authController = {

    //REGISTER
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            //Save to DB
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
            console.log("err", err);
        }
    },
    //RESET TOKEN
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
            process.env.JWT_RESET_KEY,
        );
    },

    //GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "20s" }
        );
    },
    //GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" }
        );
    },
    //LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json("Wrong username!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                return res.status(404).json("Wrong password");
            }
            if (user && validPassword) {
                // const tokenData = await create_token(userData._id);
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken, });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },


    //REDIS
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            //create new access token, refresh token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            return res.status(200).json({ accessToken: newAccessToken, });
        });
    },

    //LOG OUT
    userLogout: async (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        return res.status(200).json("Logged out!");
    },

    //RESET PASSWORD
    forgot_password: async (req, res) => {
        try {
            const email = req.body.email;
            const user = await User.findOne({ email: email });

            if (user) {
                const randomString = randomstring.generate();
                const data = await User.updateOne({ email: email }, { $set: { token: randomString } });
                authController.sendResetPasswordMail(user.username, user.email, randomString);
                res.status(200).send({ success: true, msg: "Please check your inbox of mail and reset your password. ", data: data });

            } else {
                res.status(200).send({ success: true, msg: "This email does not exists" });
            }
        } catch (err) {
            res.status(400).send({ success: false, msg: err.message });
        }
    },
    sendResetPasswordMail: async (username, email, token) => {

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.HOST,
                port: process.env.POST,

                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'For Reset Password',
                html: '<p> Hii ' + username + ', Please copy the link and <a href="http://localhost:8000/v1/auth/reset-password/' + token + '"> reset your password </a>'
            }
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Mail has been sent:- ", info.response);
                }
            })

        } catch (err) {
            res.status(400).send({ success: false, msg: err.message });
        }
    },

    reset_password: async (req, res) => {
        try {
            const id = req.params.id;
            const salt2 = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(req.body.password, salt2);

            const idData = await User.findOne({ _id: id });
            if (idData) {
                const userData = await User.findByIdAndUpdate({ _id: idData.id }, { $set: { password: hashedNewPassword } }, { new: true })
                res.status(200).send({ success: false, msg: "User password has been reset ", data: userData });
            }
            else {
                res.status(200).send({ success: false, msg: "this link has been expired. " });
            }
        } catch (err) {
            res.status(400).send({ success: false, msg: err.message });
        }
    },
};
//STORE TOKEN
//1) LOCAL STORAGE:
//XSS
//2) HTTP ONLYCOOKIES:
//CSRF -> SAMESITE
//3) REDUX STORE -> ACCESSTOKEN
// HTTPONLY COOKIES -> REFRESHTOKEN


module.exports = authController;