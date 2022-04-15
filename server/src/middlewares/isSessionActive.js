const { SESSION_TTL } = require('../util/sessionData');
const redisClient = require('../util/redisClient');
const ApiError = require('../util/ApiError');

exports.isSessionActive = (req, res, next) => {
    try {
        let { auth_type, userId, email } = req;
       
        if(auth_type === 'normal'){
            redisClient.exists(userId)
                .then((reply) => {     
                    if(reply === 1){
                        redisClient.expire(userId, SESSION_TTL);
                        next();
                    } else {
                        return next(ApiError.sessionTimeout('Session expired'));
                    }
                })
                .catch((redisErr) => {
                    return next(ApiError.apiInternal('Error occured in checking session'));
                })
        }
        else if ((auth_type === 'google') || (auth_type === 'facebook')){
            redisClient.exists(email)
                .then((reply) => {
                    if(reply === 1){
                        redisClient.expire(email, SESSION_TTL);
                        next();
                    } else {
                        return next(ApiError.sessionTimeout('Session expired'));
                    }
                })
                .catch((redisErr) => {
                    console.log("Redis Error:", redisErr);
                    return next(ApiError.apiInternal('Error occured in checking session'));
                })
        }
    } catch (error) {
        return next({});
    }
}