const express = require("express");
const CategorySchema = require("../models/Category");
const ApiError = require("../util/ApiError");

const categoryRouter = express.Router();

// @GET - Get all categories
categoryRouter.get("/all", (req, res, next) => {
    try {
        CategorySchema.find({ is_deleted: false })
            .then((categories) => {
                return res.status(201).send({ success: true, categories });
            })
            .catch((findErr) => {
                console.error("Find error:", findErr);
                return next(ApiError.apiInternal('Please try again!'));
            });
    } catch (error) {
        console.error("Error in add category request;", error);
        return next(ApiError.apiInternal('Some error occured'));
    }
});

// @POST - Add a category
categoryRouter.post("/add", (req, res, next) => {
    try {
        let { name, description } = req.body;
        if (!name || !description) {
            return next(ApiError.badRequest('Invalid category data'));
        }

        CategorySchema.create({ name, description })
            .then((category) => {
                return res.status(201).send({ success: true, category });
            })
            .catch((categoryError) => {
                console.error("Category Add Error:", categoryError);
                return next(ApiError.apiInternal('Please try again!'));
            });
    } catch (error) {
        console.error("Error in add category request;", error);
        return next(ApiError.apiInternal('Some error occured'));
    }
});

// @PUT - Edit a category
categoryRouter.put("/edit/:categoryId", (req, res, next) => {
    try {
        let categoryId = req.params?.categoryId;
        if (!categoryId || categoryId === undefined) {
            return next(ApiError.badRequest('Invalid category id'));
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
                console.error("Update Error:", updateErr?.message);
                return next(ApiError.apiInternal('Please try again!'));
            });
    } catch (error) {
        console.error("Error in edit category request;", error);
        return next(ApiError.apiInternal('Some error occured'));
    }
});

// @DELETE - Delete a category
categoryRouter.delete("/delete/:categoryId", (req, res, next) => {
    try {
        let categoryId = req.params?.categoryId;
        if (!categoryId || categoryId === undefined) {
            return next(ApiError.badRequest('Invalid category id'));
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
                console.error("Delete Error:", deleteErr?.message);
                return next(ApiError.apiInternal('Please try again!'));
            });
    } catch (error) {
        console.error("Error in delete category request;", error);
        return next(ApiError.apiInternal('Some error occured'));
    }
});

module.exports = categoryRouter;
