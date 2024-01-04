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