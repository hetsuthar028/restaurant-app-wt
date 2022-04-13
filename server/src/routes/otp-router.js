const express = require("express");
const otpRouter = express.Router();
const nodemailer = require("nodemailer");
const redis = require("redis");
const async = require("async");
const ApiError = require("../util/ApiError");

const redisClient = redis.createClient();
redisClient.connect();

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWD,
    },
});

// @POST - Send an email with an OTP
otpRouter.post("/send", (req, res, next) => {
    let { to: sendTo } = req.body;

    async.waterfall(
        [
            function (cb) {
                redisClient
                    .exists(sendTo)
                    .then((resp) => {
                        if (resp === 1) {
                            return cb(true, "Email already sent!");
                        }
                        return cb(null);
                    })
                    .catch((err) => {
                        console.error("Error in redis:", err);
                        return cb(true, "Error in redis");
                    });
            },

            function (cb) {
                let randomOTP = Math.floor(1000 + Math.random() * 9000);
                let mailOptions = {
                    from: process.env.SMTP_EMAIL,
                    to: sendTo,
                    subject: "Foodie Restaurant - Email verification",
                    html: `Dear user,

                Your OTP for Foodie Restaurant is - <b>${randomOTP}</b>.<br/>
                <i>This OPT will expire within 5 minutes!</i>
                `,
                };
                cb(null, mailOptions, randomOTP);
            },
            function (mailOptions, OTP, cb) {
                transporter
                    .sendMail(mailOptions)
                    .then((response) => {
                        console.log("Email sent", response);
                        redisClient.set(sendTo, OTP);
                        redisClient.expire(sendTo, 60 * 5);
                        cb(null, "Email sent successfully!");
                    })
                    .catch((error) => {
                        console.error("Error in sending email", error);
                        return cb(true, "Error in sending email");
                    });
            },
        ],
        function (err, data) {
            console.error(err, data);
            if (err) {
                return next(ApiError.badRequest(data));
            }
            return res
                .status(200)
                .send({ success: true, message: "Email sent!" });
        }
    );
});

// @POST - Verify user's OTP
otpRouter.post("/verify", (req, res, next) => {
    let { email, otp } = req.body;
    redisClient
        .get(email)
        .then((resp) => {
            if (resp == otp) {
                redisClient.del(email);
                return res
                    .status(200)
                    .send({ success: true, message: "Verified" });
            } else {
                return next(ApiError.badRequest("Invalid otp"));
            }
        })
        .catch((err) => {
            console.error("Error in verify:", err);
            return next(ApiError.apiInternal('Some error occured while verifying otp!'));
        });
});

module.exports = otpRouter;
