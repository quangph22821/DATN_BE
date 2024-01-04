import bcryptjs from "bcryptjs";
import dotenv from "dotenv"
import User from "../models/user";
import jwt from "jsonwebtoken"
import { signinSchema, signupSchema } from "../schemas/auth"

dotenv.config();

const {SECRET_KEY} = process.env

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

        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        
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
