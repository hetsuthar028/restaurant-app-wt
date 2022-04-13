const express = require("express");
const MenuItemSchema = require("../models/MenuItem");
const menuItemsRouter = express.Router();
const { addJobToQueue } = require("../queue/jobQueue");
const { v4: uuid4 } = require("uuid");
const ApiError = require("../util/ApiError");
const { isAdmin } = require('../middlewares/isAdmin');
const { verifyMyToken } = require('../middlewares/validate-token');
const { menuItemValidator } = require("../middlewares/menu-item-validator");
const { isSessionActive } = require('../middlewares/isSessionActive');

const PAGE_SIZE = 4;

// @POST - Add a menu item
menuItemsRouter.post("/add", menuItemValidator, verifyMyToken, isSessionActive, isAdmin, (req, res, next) => {
    try {
        MenuItemSchema.create({
            ...req.body,
        })
            .then((menuItem) => {
                // Add a job to queue here with menu id, images

                addJobToQueue({
                    jobId: uuid4(),
                    menuId: menuItem._id,
                    images: req.body.images,
                    authHeader: req.headers.authorization,
                });
                return res.status(201).send({ success: true, menuItem });
            })
            .catch((menuItemErr) => {
                console.error("Error in adding menu item in DB:", menuItemErr);
                return next(ApiError.badRequest("Menu item can't be added"));
            });
    } catch (error) {
        console.error("Error in add menu item request;", error);
        return next(ApiError.apiInternal('Some error occured while adding menu item'));
    }
});

// @GET - All menu items
menuItemsRouter.get("/all", verifyMyToken, isSessionActive, (req, res, next) => {
    try {
        let {available, is_veg, category, query, price, size, page} = req.query;
        
        // Availability filter
        if(available === 'true'){
            available = true;
        }
        else if (available === 'false') {
            available = false;
        }
        
        // is_veg filter
        if(is_veg === 'true'){
            is_veg = true;
        }
        else if (is_veg === 'false') {
            is_veg = false;
        }

        let filters = {
            available,
            is_veg,
            category,
            // name : `/${query}/`, // [1st approach]
            // $text: {$search: query}, // [2nd approach - text index | Drawback - can't do partial search]
            name: new RegExp(`.*${query}.*`, 'gi'),
        }

        const sortingFilter = {
            price: price,
        }
        if(available === 'all' || available === undefined){
            delete filters['available'];
        }
        if(is_veg === 'all' || is_veg === undefined){
            delete filters['is_veg'];
        }
        if(category === 'all' || category === undefined){
            delete filters['category'];
        }
        if(query === '' || query === undefined){
            delete filters['name'];
        }
        if(price === '' || price === '0' || price === undefined){
            delete sortingFilter['price'];
        }

        console.log("Filters", filters);

        size = parseInt(size ?? PAGE_SIZE);
        page = parseInt(page ?? 0);

        if(size < 0 || page < 0){
            return next(ApiError.badRequest('Invalid pagination request'));
        }

        MenuItemSchema.ensureIndexes({name: 'text'});
        MenuItemSchema.find({ is_deleted: false, ...filters }).sort({...sortingFilter})
            .then((menuItems) => {
                console.log("Total records sent:", menuItems.length);
                return res.status(200).send({ success: true, menuItems });
            })
            .catch((findErr) => {
                console.log("Find error:", findErr);
                return next(ApiError.badRequest("Can't find the requested information"));
            });
    } catch (error) {
        console.log("Error in add menu item request;", error);
        return next(ApiError.apiInternal('Please try again'));
    }
});

// @GET - Menu Item by ID
menuItemsRouter.get("/id/:menuId", verifyMyToken, isSessionActive, (req, res, next) => {
    try {
        let menuId = req.params?.menuId;
        if (!menuId || menuId === undefined) {
            return next(ApiError.badRequest('Invalid menu id'));
        }

        MenuItemSchema.findOne({ _id: menuId, is_deleted: false })
            .then((menuItem) => {
                return res.status(200).send({ success: true, menuItem });
            })
            .catch((findErr) => {
                console.error("Find error:", findErr);
                return next(ApiError.notFound("Menu item can't be found"));
            });
    } catch (error) {
        console.error("Error in get menu item request;", error);
        return next(ApiError.apiInternal('Some error occured'));
    }
});

// @PUT - Edit a menu item
menuItemsRouter.put("/edit/:menuId", verifyMyToken, isSessionActive, isAdmin, (req, res, next) => {
    try {
        let menuId = req.params?.menuId;
        if (!menuId || menuId === undefined) {
            return next(ApiError.badRequest('Invalid menu id'));
        }

        MenuItemSchema.updateOne(
            { _id: menuId, is_deleted: false },
            {
                $set: req.body,
            }
        )
            .then((menuItem) => {
                if(req.body.images && req.body.name){
                    addJobToQueue({
                        jobId: uuid4(),
                        menuId: menuId,
                        images: req.body.images,
                        existingImages: req.body.existingImages ?? [],
                        authHeader: req.headers.authorization,
                    });
                }
                return res.status(200).send({ success: true, menuItem });
            })
            .catch((menuItemErr) => {
                console.error("Edit - Menu Item Error:", menuItemErr.message);

                if (
                    menuItemErr.message
                        .toString()
                        .indexOf("Cast to ObjectId failed") > -1
                ) {
                    return next(ApiError.badRequest('Invalid menu id'));
                }

                return next(ApiError.badRequest('Please try again!'));
            });
    } catch (error) {
        console.error("Error in edit menu item request;", error);
        return next(ApiError.apiInternal('Some error occured'));
    }
});

// @DELETE - Delete a menu item
menuItemsRouter.delete("/delete/:menuId", verifyMyToken, isSessionActive, isAdmin, (req, res, next) => {
    try {
        let menuId = req.params.menuId;
        if (!menuId || menuId === undefined) {
            return next(ApiError.badRequest('Invalid menu id'));
        }

        MenuItemSchema.updateOne(
            {
                _id: menuId,
                is_deleted: false,
            },
            { $set: { is_deleted: true } }
        )
            .then((deleteResp) => {
                return res.status(200).send({ success: true, deleteResp });
            })
            .catch((deleteErr) => {
                console.error("Item Delete Error:", deleteErr.message);
                return next(ApiError.badRequest('Please try again!'));
            });
    } catch (error) {
        console.error("Error in edit menu item request;", error);
        return next(ApiError.apiInternal('Some error occured'));
    }
});

module.exports = menuItemsRouter;
