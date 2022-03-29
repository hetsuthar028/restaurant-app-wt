exports.userDataValidator = (req, res, next) => {
    let { username, email, password, confirmPassword } = req.body;
    let emailRegEx =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!username || username.length < 3) {
        return res
            .status(400)
            .send({ success: false, message: "Invalid username" });
    }

    if (!email || !emailRegEx.test(email.toLowerCase())) {
        return res
            .status(400)
            .send({ success: false, message: "Invalid email address" });
    }

    if (!password || password.length < 8) {
        return res
            .status(400)
            .send({
                success: false,
                message: "Password must be longer than 8 characters!",
            });
    }

    if (password != confirmPassword) {
        return res
            .status(400)
            .send({ success: false, message: "Password does not match!" });
    }

    next();
};
