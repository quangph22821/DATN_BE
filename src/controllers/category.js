import dotenv from "dotenv";
import joi from "joi";
import Product from "../models/product";
import Category from "../models/category";

dotenv.config();

const categorySchema = joi.object({
    name: joi.string().required(),
});

export const getAll = async (req, res) => {
    try {
        const categories = await Category.find().populate("productId");
        if (categories.length===0) {
            return res.status(400).json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        return res.status(200).json({
            message: "Lấy sản phẩm thành công",
            categories,
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const get = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate("productId");
        console.log("category", category);
        if (!category) {
            return res.json({
                message: "Không tìm thấy danh mục",
            });
        }
        const products = await Product.find({ categoryId: req.params.id });
        return res.json({
            message: "Lấy danh mục thành công",
            category: {
                ...category.toObject(),
                products,
            },
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};