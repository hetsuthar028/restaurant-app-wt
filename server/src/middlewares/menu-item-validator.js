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
        // ingredients.length === 0 ||
        // images.length === 0 ||
        !preparationTime ||
        // !recipe.length === 0 ||
        is_veg === undefined ||
        is_jain === undefined ||
        available === undefined
    ) {
        return res.status(400).send({
            success: false,
            message: "Please check all the fields and try again!",
        });
    }

    // if (description.toString().length > 200) {
    //     return res.status(400).send({
    //         success: false,
    //         message: "Description must be shorter than 200 characters",
    //     });
    // }

    next();
};
