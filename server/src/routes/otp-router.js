const express = require('express');
const otpRouter = express.Router();
const nodemailer = require('nodemailer');
const redis = require('redis');
const async = require('async');
const ApiError = require('../util/ApiError');
const { default: axios } = require('axios');
const UserSchema = require('../models/User');

const redisClient = redis.createClient();
redisClient.connect();

otpRouter.get('/', (req, res) => {
    return res.send('Welcome to the email router');
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWD,
    }
});


// @POST - Send an email with an OTP
otpRouter.post('/send', (req, res, next) => {
    let {to: sendTo} = req.body;

    async.waterfall([
        function(cb){
            redisClient.exists(sendTo)
                .then((resp) => {
                    if(resp === 1){
                        return cb(true, 'Email already sent!');
                    }
                    return cb(null);
                })
                .catch((err) => {
                    console.log("Error in redis:", err);
                    return cb(true, 'Error in redis');
                })
        },

        function(cb){
            let randomOTP = Math.floor(1000 + Math.random() * 9000);
            let mailOptions = {
                from: 'hetsuthar18@gnu.ac.im',
                to: sendTo,
                subject: "Foodie Restaurant - Email verification",
                html: `Dear user,

                Your OTP for Foodie Restaurant is - <b>${randomOTP}</b>.<br/>
                <i>This OPT will expire within 10 minutes!</i>
                `
            }
            cb(null, mailOptions, randomOTP)
        },
        function(mailOptions, OTP, cb){
            transporter.sendMail(mailOptions).then((response) => {
                console.log("Email sent", response);
                redisClient.set(sendTo, OTP);
                redisClient.expire(OTP, 60*10);
                cb(null, 'Email sent successfully!');
            }).catch((error) => {
                console.log("Error in sending email", error);
                return cb(true, 'Error in sending email');
            })
        }
    ], function(err, data){
        console.log(err, data);
        if(err){
            return next(ApiError.badRequest(data));
        }
        return res.status(200).send({success: true, message: "Email sent!"});
    })
});


// @POST - Verify user's OTP
otpRouter.post('/verify', (req, res, next) => {
    let {email, otp} = req.body;
    redisClient.get(email)
        .then((resp) => {
            console.log("Verify response", resp);
            if(resp == otp){
                redisClient.del(email);
                return res.status(200).send({success: true, message: "Verified"});
            } else {
                return next(ApiError.badRequest('Invalid otp'));
            }
        })
        .catch((err) => {
            console.log("Error in verify:", err);
        })
})



// @POST - Send an email with link
// otpRouter.post('/send', (req, res) => {
//     console.log("Received send request");
//     async.waterfall([
//         function(callback){
//             console.log("First func")
//             redisClient.exists(req.body.to)
//             .then((resp) => {
//                 if(resp === 1){
//                     console.log("Email exists");
//                     return callback(true, 'Email already sent!');
//                 }
//                 callback(null);
//             })
//             .catch((err) => {
//                 console.log("Redis error");
//                     return callback(true, 'Error in redis');
//             })
//         },
//         function(cb){
//             let randomNumber = Math.floor((Math.random() * 100) + 54);
//             let encodedEmail = new Buffer(req.body.to).toString('base64');
//             let link = 'http://' + req.get('host') + '/verify?mail='+encodedEmail+'&id='+randomNumber;
//             let mailOptions = {
//                 from: 'hetsuthar18@gnu.ac.in',
//                 to: req.body.to,
//                 subject: "Foodie Restaurant - Email verification",
//                 html: 'Dear user, Please click on the following link to verify your email.' + link + '>Click here to verify',
//             }
//             console.log("Forwarded from 2");
//             cb(null, mailOptions, randomNumber);
//         },
//         function(mailData, secretKey, cb){
//             console.log("Mail data", mailData);

//             transporter.sendMail(mailData).then((response) => {
//                 console.log("Email sent");
//                 redisClient.set(req.body.to, secretKey);
//                 redisClient.expire(req.body.to, 60*10);
//                 cb(null, 'Email sent successfully!');
//             }).catch((error) => {
//                 console.log("Error in sending email", error);
//                 return cb(true, 'Error in sending email');
//             })
//         }
//     ], function(err, data){
//         console.log(err, data);
//         return res.json({error: err === null ? false : true, data: data});
//     })

//     // let testAccount = await nodemailer.createTestAccount();
//     // redisClient.set('hetmewada028@gmail.com', 'Helloworld');

    
    

//     // let info = await transporter.sendMail({
//     //     from: 'hetsuthar18@gnu.ac.in',
//     //     to: 'hetsuthar028@gmail.com',
//     //     subject: "Test email from nodemailer",
//     //     text: "This is the dummy text included with the test email",
//     //     html: '<h3>Hello World</h3>'
//     // });

//     // console.log('Message sent:', info.messageId);
//     // console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
//     // res.send('Mail sent');
// });

module.exports = otpRouter;