const ApiError = require('../util/ApiError');

exports.userDataValidator = (req, res, next) => {
    let { username, email, password, confirmPassword } = req.body;
    let emailRegEx =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!username || username.length < 3) {
        return next(ApiError.badRequest('Invalid username'));
    }

    if (!email || !emailRegEx.test(email.toLowerCase())) {
        return next(ApiError.badRequest('Invalid email address'));
    }

    if (!password || password.length < 8) {
        return next(ApiError.badRequest("Password must be longer than 8 characters!"));
    }

    if (password != confirmPassword) {
        return next(ApiError.badRequest("Password does not match!"));
    }

    next();
};
