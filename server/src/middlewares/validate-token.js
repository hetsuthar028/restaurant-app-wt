require("dotenv").config();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ApiError = require('../util/ApiError');

exports.verifyMyToken = async (req, res, next) => {
    try {
        let bearer = JSON.parse(req.headers.authorization ?? "");
        if (bearer === null) {
            return next(ApiError.badRequest('Invalid token'));
        }

        // Normal auth type - Token Validation
        if (bearer["login_type"] === "normal") {
            let validToken = jwt.verify(bearer.token, process.env.JWT_SECRET);

            if (validToken) {
                let userId = jwt.decode(bearer.token).userId;

                if (!userId) {
                    return next(ApiError.badRequest('Invalid token'));
                }

                req.userId = userId;
                req.auth_type = "normal";
                next();
            } else {
                return next(ApiError.badRequest('Invalid token'));
            }
        } else if (bearer["login_type"] === "google") {
            // Verify here google token id with google-auth-library

            const ticket = await client.verifyIdToken({
                idToken: bearer.token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            console.log(`User ${payload.name} verified.`);

            const { sub, email, name, picture } = payload;
            req.auth_type = "google";
            req.email = email;

            next();
        }
    } catch (error) {
        return next(ApiError.badRequest('Invalid token'));
    }
};
