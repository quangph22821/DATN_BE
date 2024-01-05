import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user";
dotenv.config();

export const authenticate = async (req, res, next) => {
    try {
        // Kiểm tra có thông tin token không
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: "Bạn phải đăng nhập để thực hiện hành động này!",
            });
        }

        // Lấy mã token
        const token = req.headers.authorization.split(" ")[1];

        const { _id } = jwt.verify(token, process.env.SECRET_KEY);
        // Tìm user từ id
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({
                message: "Tài khoản không hợp lệ!",
            });
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token không hợp lệ!" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token đã hết hạn!" });
        }

        return res.status(401).json({ message: error.message });
    }
};

// Bước 1: kiểm tra thông tin token gửi có không? Nếu không có thì thông báo cần phải đăng nhập
// Bước 2: Lấy token bằng cách chuyển từ chuỗi sang mảng và lấy phần tử thứ 2
// Bước 3: Kiểm tra token có hợp lệ không? Nếu không hợp lệ thì thông báo cần phải đăng nhập
// Bước 4: Giải mã token và lấy ID, kiểm tra ID tồn tại trong db không?
// Bước 5: Kiểm tra quyền của user có phải là admin không? Nếu không phải thì thông báo không có quyền truy cập tài nguyên
// Bước 6: Nếu hợp lệ thì cho phép truy cập tài nguyên
// Bước 7: Gắn middleware vào router nào cần check quyền