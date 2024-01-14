import bcrypt from "bcryptjs";
import dotenv from "dotenv"
import User from "../models/user";
import jwt from "jsonwebtoken"
import { signinSchema, signupSchema } from "../schema/auth"
import nodemailer from "nodemailer"
import crypto from "crypto";

dotenv.config();

const {SECRET_KEY} = process.env
const { MAIL_USERNAME } = process.env
const { MAIL_PASSWORD } = process.env
const { MAIL_FROM_ADDRESS } = process.env

export const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const { error } = signupSchema.validate(req.body, { abortEarly: false });

        // check lỗi 
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }

        // kiểm tra tồn tại email

        const userExist = await User.findOne({ email: req.body.email});


        if (userExist) {
            return res.status(400).json({
                message: "Email đã được đăng kí",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        user.password = undefined;



        //tao token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
        return res.status(201).json({
            message: "Đăng ký thành công",
            accessToken: token,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            name:error.name,
            message: error.message
        })
     }
};


export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = signinSchema.validate(req.body, { abortEarly: false });
        //validate
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }

        //kiểm tra email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Tài khoản không tồn tại",
            });
        }
        // nó vừa mã hóa và vừa so sánh
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Sai mật khẩu",
            });
        }

        user.password = undefined;
        // tạo token từ server
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });

        return res.status(201).json({
            message: "Đăng nhập thành công",
            accessToken: token,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
     }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Tạo liên kết xác thực
        // Tạo một password ngẫu nhiên có độ dài là 8 ký tự
        const passwordNew = crypto.randomBytes(4).toString('hex')
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Tài khoản của bạn không tồn tại",
            });
        }
        // Cập nhật mật khẩu mới và mã hõa của người dùng trong cơ sở dữ liệu
        user.password = await bcrypt.hash(passwordNew, 10);
        await user.save();
        // Gửi email mật khẩu mới
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: `${MAIL_USERNAME}`,
                pass: `${MAIL_PASSWORD}`,
            },
        });
        const mailOptions = {
            from: `${MAIL_FROM_ADDRESS}`,
            to: email,
            subject: 'Quên mật khẩu',
            text: `Bạn vừa quên mật phải không ?. Mật khẩu mới của bạn là: ${passwordNew}`,
        };
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({
                    message: error
                })
            } else {
                return res.status(200).json({
                    message: info.response
                })
            }
        });
        return res.status(200).json({
            message: "Chúng tôi đã gửi cho bạn mật khẩu mới",
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        })
    }
};





export const update = async (req, res) => {
  try {
    // Kiểm tra nếu yêu cầu không chứa trường mật khẩu mới
    if (!req.body.password) {
      return res.status(400).json({
        message: "Vui lòng cung cấp mật khẩu mới để cập nhật",
      });
    }

    // Mã hóa mật khẩu mới trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Tạo đối tượng chứa chỉ các trường cần cập nhật (ở đây chỉ có trường mật khẩu)
    const updateFields = {
      password: hashedPassword,
    };

    // Sử dụng findOneAndUpdate thay vì findByIdAndUpdate để có thể truy cập và kiểm tra kết quả trước khi trả về
    const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    // Kiểm tra xem user có tồn tại hay không
    if (!user) {
      return res.status(400).json({
        message: "Người dùng không tồn tại",
      });
    }

    return res.status(200).json({
      message: "Cập nhật mật khẩu thành công",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};