require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.vertifyToken = (req, res, next) => {
    try {
        let bearer = req.headers.authorization;
        if (!bearer) {
            return res
                .status(401)
                .send({ success: false, message: "Invalid token in headers" });
        }

        let validToken = jwt.verify(bearer, process.env.JWT_SECRET);
        if(validToken){
            let userId = jwt.decode(bearer).userId;
            if(!userId){
                return res.status(401).send({success: false, messag: "Invalid token"});
            }

            req.userId = userId;
            next();
        }
        else {
            return res.status(401).send({success: false, messag: "Invalid token"});
        }
    } catch (error) {
        return res.status(401).send({success: false, messag: "Invalid token"});
    }
};
