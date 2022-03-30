const express = require("express");
const CategorySchema = require("../models/Category");

const categoryRouter = express.Router();

// @GET - Get all categories
categoryRouter.get("/all", (req, res) => {
    try {
        CategorySchema.find({ is_deleted: false })
            .then((categories) => {
                return res.status(201).send({ success: true, categories });
            })
            .catch((findErr) => {
                console.log("Find error:", findErr);
                return res
                    .status(500)
                    .send({ success: false, message: "Some error occured!" });
            });
    } catch (error) {
        console.log("Error in add category request;", error);
        return res
            .status(400)
            .send({ success: false, message: "Please try again!" });
    }
});

// @POST - Add a category
categoryRouter.post("/add", (req, res) => {
    try {
        let { name, description } = req.body;
        if (!name || !description) {
            return res
                .status(400)
                .send({ success: false, message: "Invalid category data" });
        }

        CategorySchema.create({ name, description })
            .then((category) => {
                return res.status(201).send({ success: true, category });
            })
            .catch((categoryError) => {
                console.log("Category Add Error:", categoryError);
                return res
                    .status(500)
                    .send({ success: false, message: "Some error occured!" });
            });
    } catch (error) {
        console.log("Error in add category request;", error);
        return res
            .status(400)
            .send({ success: false, message: "Please try again!" });
    }
});

// @PUT - Edit a category
categoryRouter.put("/edit/:categoryId", (req, res) => {
    try {
        let categoryId = req.params?.categoryId;
        if (!categoryId || categoryId === undefined) {
            return res
                .status(400)
                .send({ success: false, message: "Invalid category Id" });
        }

        CategorySchema.updateOne(
            {
                _id: categoryId,
                is_deleted: false,
            },
            {
                $set: req.body,
            }
        )
            .then((updateResp) => {
                return res.status(200).send({ success: true, updateResp });
            })
            .catch((updateErr) => {
                console.log("Update Error:", updateErr?.message);
                return res
                    .status(500)
                    .send({ success: false, message: "Some error occured!" });
            });
    } catch (error) {
        console.log("Error in edit category request;", error);
        return res
            .status(400)
            .send({ success: false, message: "Please try again!" });
    }
});

// @DELETE - Delete a category
categoryRouter.delete("/delete/:categoryId", (req, res) => {
    try {
        let categoryId = req.params?.categoryId;
        if (!categoryId || categoryId === undefined) {
            return res
                .status(400)
                .send({ success: false, message: "Invalid category Id" });
        }

        CategorySchema.updateOne(
            {
                _id: categoryId,
                is_deleted: false,
            },
            {
                $set: { is_deleted: true },
            }
        )
            .then((deleteResp) => {
                return res.status(200).send({ success: true, deleteResp });
            })
            .catch((deleteErr) => {
                console.log("Delete Error:", deleteErr?.message);
                return res
                    .status(500)
                    .send({ success: false, message: "Some error occured!" });
            });
    } catch (error) {
        console.log("Error in delete category request;", error);
        return res
            .status(400)
            .send({ success: false, message: "Please try again!" });
    }
});

module.exports = categoryRouter;
