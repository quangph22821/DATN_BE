import dotenv from "dotenv";
import joi from "joi";
import Product from "../models/product";
import Material from "../models/material";

dotenv.config();

const MaterialSchema = joi.object({
    name: joi.string().required(),
});

export const getAll = async (req, res) => {
    try {
        const material = await Material.find().populate("productId");
        if (material.length===0) {
            return res.json({
                message: "Không tìm thấy chat lieu",
            });
        }
        return res.json({
            message: "Lấy sản phẩm thành công",
            material,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
export const get = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id).populate("productId");
        console.log("material", material);
        if (!material) {
            return res.json({
                message: "Không tìm thấy chat lieu",
            });
        }
        const products = await Product.find({ materialId: req.params.id });
        return res.json({
            message: "Lấy danh mục thành công",
            material: {
                ...material.toObject(),
                products,
            },
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
export const create = async (req, res) => {
    try {
        // validate
        const { error } = MaterialSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const material = await Material.create(req.body);
        if (!material) {
            return res.json({
                message: "Thêm chat lieu không thành công",
            });
        }
        return res.json({
            message: "Thêm chat lieu thành công",
            material,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};


export const remove = async (req, res) => {
    try {
        const material = await Material.findByIdAndDelete(req.params.id);
        if (!material) {
            return res.status(404).json({
                message: "Xoa Khong Thanh Cong"
            })
        }
        return res.status(200).json({
            message: "xoá thanh cong",
            material,
        })

    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}


//update
export const update = async(req,res)=>{
    try {
        const material = await Material.findByIdAndUpdate(req.params.id,req.body)
        if(!material){
            return res.status(400).json({
                message:"Update không thành công"
            })
        }
        return res.status(200).json({
            message:"Update thành công",
            data: material
        })
    } catch (error) {
        return res.status(400).json({
            message:"Lỗi server"
        })
    }
}