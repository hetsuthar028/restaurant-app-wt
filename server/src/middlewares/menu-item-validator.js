const ApiError = require('../util/ApiError');

exports.menuItemValidator = (req, res, next) => {
    let {
        name,
        description,
        price,
        category,
        ingredients = [],
        images = [],
        preparationTime,
        available,
        recipe = [],
        is_veg,
        is_jain,
        ratings,
    } = req.body;

    if (
        !name ||
        !description ||
        !price ||
        !category ||
        !preparationTime ||
        is_veg === undefined ||
        is_jain === undefined ||
        available === undefined
    ) {
        return next(ApiError.badRequest('Please check all the fields and try again!'));
    }
    next();
};
