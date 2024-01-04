import Product from "../models/product";
export const getAll = async (req, res) => {
    try {
        const product = await Product.find().populate("categoryId").populate("materialId").populate("originId");
        if (product.length === 0) {
            return res.status(404).json({
                massage: "khong co san pham nao"
            })
        }
        return res.json({
            message: "hien thi thanh cong",
            product,
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
}

export const getId = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("categoryId").populate("materialId").populate("originId");
        if (!product) {
            return res.status(404).json({
                massage: "khong co san pham nao"
            })
        }
        return res.json({
            message: "hien thi  thanh cong",
            product,
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
}


export const postProduct = async (req, res) => {
    try {
        // const {error} = ProductSchema.validate(req.body)
        // if(error){
        //     return res.status(400).json({
        //         message: error.details[0].message
        //     })
        // }
        const product = await Product.create(req.body)
        if (!product) {
            return res.status(404).json({
                massage: "khong co san pham nao"
            })
        }
        return res.json({
            message: "them thanh cong",
            product,
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
}