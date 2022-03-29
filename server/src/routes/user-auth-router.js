const express = require("express");
const userRouter = express.Router();
const UserSchema = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Middleware
const { userDataValidator } = require("../middlewares/user-validator");
const { vertifyToken } = require("../middlewares/verify-token");

userRouter.get("/", (req, res) => {
    res.send("Welcome");
});

// @POST - User registration
userRouter.post("/signup", userDataValidator, (req, res) => {
    try {
        const { username, email, password, role = "re.user" } = req.body;

        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(password, salt);
        let newUser = new UserSchema({
            username,
            email,
            password: hashedPassword,
            role,
        });

        UserSchema.findOne({
            email: email,
        }).then((user) => {
            if (user) {
                return res
                    .status(400)
                    .send({ success: false, message: "User already exists!" });
            }

            newUser
                .save()
                .then((saveUserResp) => {
                    console.log("User created successfully!");
                    return res.status(201).send({
                        success: true,
                        message: "User created successfully!",
                        user: saveUserResp,
                    });
                })
                .catch((saveUserErr) => {
                    console.log("Error creating user", saveUserErr.message);
                    return res.status(400).send({
                        success: false,
                        message: "Some error occured!",
                    });
                });
        });
    } catch (error) {
        console.log("Error ", error);
    }
});

// @POST - User login
userRouter.post("/login", (req, res) => {
    try {
        let { email, password } = req.body;
        UserSchema.findOne({ email: email })
            .then((user) => {
                if (user === null) {
                    return res.status(400).send({
                        success: false,
                        message: "Invalid email or password",
                    });
                }

                if (bcrypt.compareSync(password ?? "", user.password)) {
                    let token = jwt.sign(
                        { userId: user._id },
                        process.env.JWT_SECRET,
                        { expiresIn: 60 * 60 }
                    );
                    return res.status(200).send({ success: true, token });
                }
                return res.status(400).send({
                    success: false,
                    message: "Invalid email or password",
                });
            })
            .catch((err) => {
                console.log("Error while getting user", err);
                return res
                    .status(400)
                    .send({ success: false, message: "Some error occured!" });
            });
    } catch (error) {
        console.log("Some error", error);
    }
});

// @GET - Current user
userRouter.get("/currentuser", vertifyToken, (req, res) => {
    let userId = req.userId;

    UserSchema.findById({ _id: userId }, {password: 0})
        .then((user) => {
            if (!user) {
                return res
                    .status(400)
                    .send({ success: false, message: "Invalid token" });
            }

            return res.status(200).send({ success: true, user });
        })
        .catch((userErr) => {
            console.log("Error while fetching user", userErr.message);
            return res
                .status(400)
                .send({ success: false, message: "Some error occured!" });
        });
});

module.exports = userRouter;
