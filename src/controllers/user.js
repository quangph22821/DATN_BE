import dotenv from "dotenv";
import User from "../models/user";

dotenv.config();

export const getAll = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.json({
        message: "Không tìm thấy tài khoản",
      });
    }
    return res.json({
      message: "Lấy tài khoản thành công",
      users,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin người dùng" });
    }

    return res
      .status(200)
      .json({ message: "Lấy thông tin người dùng thành công!", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};