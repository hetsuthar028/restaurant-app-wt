const ApiError = require('../util/ApiError');
const UserSchema = require('../models/User');

exports.isAdmin = async (req, res, next) => {
    try {
        let {auth_type, userId, email} = req;
        let userFilter = {}

        if(auth_type === 'normal'){
            userFilter['_id'] = userId
        } else {
            userFilter['email'] = email;
        }

        let response = await UserSchema.findOne({ ...userFilter, is_deleted: false}, {is_admin: 1})

        if(response.is_admin === true){
            return next();
        } else {
            return next(ApiError.unauthorizedRequest('Not an admin'));
        }
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        return next(ApiError.apiInternal('Some error occured'));
    }
}