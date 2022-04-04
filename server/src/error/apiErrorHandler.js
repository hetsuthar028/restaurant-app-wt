const ApiError = require("../util/ApiError");

function apiErrorHandler(err, req, res, next){
    console.error("Handler", err);
    
    if(err instanceof ApiError){
        return res.status(err.status).send({success: false, message: err.message});
    }

    return res.status(500).send({success: false, message: "Internal server error"});
}

module.exports = apiErrorHandler;