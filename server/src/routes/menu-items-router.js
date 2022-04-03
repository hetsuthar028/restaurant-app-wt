const express = require("express");
const { menuItemValidator } = require("../middlewares/menu-item-validator");
const MenuItemSchema = require("../models/MenuItem");
const menuItemsRouter = express.Router();
const axios = require("axios");
const { addJobToQueue } = require("../queue/jobQueue");
const { v4: uuid4 } = require("uuid");

const PAGE_SIZE = 4;

// @POST - Add a menu item
menuItemsRouter.post("/add", menuItemValidator, (req, res) => {
    try {
        MenuItemSchema.create({
            ...req.body,
        })
            .then((menuItem) => {
                // Add a job to queue here with menu id, images
                console.log("First resp", menuItem._id, req.body.images);
                addJobToQueue({
                    jobId: uuid4(),
                    menuId: menuItem._id,
                    images: req.body.images,
                });
                return res.status(201).send({ success: true, menuItem });
            })
            .catch((menuItemErr) => {
                console.log("Error in adding menu item in DB:", menuItemErr);
                return res
                    .status(500)
                    .send({ success: false, message: "Some error occured!" });
            });
    } catch (error) {
        console.log("Error in add menu item request;", error);
        return res
            .status(400)
            .send({ success: false, message: "Please try again!" });
    }
});

// @GET - All menu items
menuItemsRouter.get("/all", (req, res) => {
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
        if(page === undefined){
            page = 0
        }
        if(size === undefined){
            size = PAGE_SIZE;
        }

        console.log("Filters", filters);

        size = parseInt(size);
        page = parseInt(page);

        if(size < 0 || page < 0){
            return res.status(400).send({success: false, message: "Invalid pagination request"});
        }


        MenuItemSchema.ensureIndexes({name: 'text'});
        MenuItemSchema.find({ is_deleted: false, ...filters }).sort({...sortingFilter})
            .then((menuItems) => {
                console.log("Total records sent:", menuItems.length);
                
                // MenuItemSchema.count({is_deleted: false, ...filters})
                //     .then((totalCount) => {
                //         console.log("Total Count", totalCount);
                //         let totalPages = Math.ceil(totalCount / size);
                        
                //     })

                return res.status(200).send({ success: true, menuItems });
            })
            .catch((findErr) => {
                console.log("Find error:", findErr);
                return res
                    .status(500)
                    .send({ success: false, message: "Some error occured!" });
            });
    } catch (error) {
        console.log("Error in add menu item request;", error);
        return res
            .status(400)
            .send({ success: false, message: "Please try again!" });
    }
});

// @GET - Menu Item by ID
menuItemsRouter.get("/id/:menuId", (req, res) => {
    try {
        let menuId = req.params?.menuId;
        if (!menuId || menuId === undefined) {
            return res
                .status(400)
                .send({ success: false, message: "Invalid menu Id" });
        }

        MenuItemSchema.findOne({ _id: menuId, is_deleted: false })
            .then((menuItem) => {
                return res.status(200).send({ success: true, menuItem });
            })
            .catch((findErr) => {
                console.log("Find error:", findErr);
                return res
                    .status(500)
                    .send({ success: false, message: "Some error occured!" });
            });
    } catch (error) {
        console.log("Error in get menu item request;", error);
        return res
            .status(400)
            .send({ success: false, message: "Please try again!" });
    }
});

// @PUT - Edit a menu item
menuItemsRouter.put("/edit/:menuId", (req, res) => {
    try {
        let menuId = req.params?.menuId;
        if (!menuId || menuId === undefined) {
            return res
                .status(400)
                .send({ success: false, message: "Invalid menu Id" });
        }

        MenuItemSchema.updateOne(
            { _id: menuId, is_deleted: false },
            {
                $set: req.body,
            }
        )
            .then((menuItem) => {
                // console.log("Existing images", req.body.existingImages ?? []);
                if(req.body.images && req.body.name){
                    addJobToQueue({
                        jobId: uuid4(),
                        menuId: menuId,
                        images: req.body.images,
                        existingImages: req.body.existingImages ?? []
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
                    return res.status(400).send({
                        success: false,
                        message: "Invalid menu item id",
                    });
                }

                return res
                    .status(500)
                    .send({ success: false, message: "Some error occured!" });
            });
    } catch (error) {
        console.log("Error in edit menu item request;", error);
        return res
            .status(400)
            .send({ success: false, message: "Please try again!" });
    }
});

// @DELETE - Delete a menu item
menuItemsRouter.delete("/delete/:menuId", (req, res) => {
    try {
        let menuId = req.params.menuId;
        if (!menuId || menuId === undefined) {
            return res
                .status(400)
                .send({ success: false, message: "Menu Id is required" });
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
                console.log("Item Delete Error:", deleteErr.message);
                return res
                    .status(500)
                    .send({ success: false, message: "Some error occured!" });
            });
    } catch (error) {
        console.log("Error in edit menu item request;", error);
        return res
            .status(400)
            .send({ success: false, message: "Please try again!" });
    }
});

module.exports = menuItemsRouter;
