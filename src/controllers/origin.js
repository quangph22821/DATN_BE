import dotenv from "dotenv";
import joi from "joi";
import Origin from "../models/origin";
import Product from "../models/product";

dotenv.config();

const OriginSchema = joi.object({
    name: joi.string().required(),
});

export const getAll = async (req, res) => {
    try {
        const origin = await Origin.find().populate("productId");
        if (origin.length===0) {
            return res.json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        return res.json({
            message: "Lấy sản phẩm thành công",
            origin,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
export const get = async (req, res) => {
    try {
        const origin = await Origin.findById(req.params.id).populate("productId");
        console.log("origin", origin);
        if (!origin) {
            return res.json({
                message: "Không tìm thấy danh mục",
            });
        }
        const products = await Product.find({ originId: req.params.id });
        return res.json({
            message: "Lấy danh mục thành công",
            origin: {
                ...origin.toObject(),
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
        const { error } = OriginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const origin = await Origin.create(req.body);
        if (!origin) {
            return res.json({
                message: "Thêm danh mục không thành công",
            });
        }
        return res.json({
            message: "Thêm danh mục thành công",
            origin,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};


export const remove = async (req, res) => {
    try {
        const origin = await Origin.findByIdAndDelete(req.params.id);
        if (!origin) {
            return res.status(404).json({
                message: "Xoa Khong Thanh Cong"
            })
        }
        return res.status(200).json({
            message: "xoá thanh cong",
            origin,
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
        const origin = await Origin.findByIdAndUpdate(req.params.id,req.body)
        if(!origin){
            return res.status(400).json({
                message:"Update không thành công"
            })
        }
        return res.status(200).json({
            message:"Update thành công",
            data: origin
        })
    } catch (error) {
        return res.status(400).json({
            message:"Lỗi server"
        })
    }
}