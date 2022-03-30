const express = require("express");
const { menuItemValidator } = require("../middlewares/menu-item-validator");
const MenuItemSchema = require("../models/MenuItem");
const menuItemsRouter = express.Router();

// @POST - Add a menu item
menuItemsRouter.post("/add", menuItemValidator, (req, res) => {
    try {
        MenuItemSchema.create({
            ...req.body,
        })
            .then((menuItem) => {
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
        MenuItemSchema.find({ is_deleted: false })
            .then((menuItems) => {
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
