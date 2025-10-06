const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SUPER_ADMIN = process.env.SUPER_ADMIN;
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { college, password, email } = req.body;
        if (!college || !password || !email) {
            return res.send({
                success: false,
                status: 400,
                message: "Enter All Fields"
            })
        }
        console.log(college)

        const isValidEmail = await UserModel.findOne({ email: email,verified:true });
        if (isValidEmail) {
            return res.send({
                success: false,
                status: 401,
                message: "Already Registered Try Logging in"
            })
        }
        const isValidName = await UserModel.findOne({ name: college });
        if (isValidName) {
            return res.send({
                success: false,
                status: 401,
                message: "Name already taken"
            })
        }
        console.log(isValidEmail)

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            name: college,
            password: hashPassword,
            email: email,
        })
        await user.save()
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
        );

        return res.send({
            success: true,
            status: 200,
            message: "User Registered Successfully wait for the admin to verify or contact at " + process.env.CONTACT,
            token: token,
        })
    } catch (error) {
        console.log(error)
    }
}

const login = async (req, res) => {
    try {
        const { password, email } = req.body;
        if (!password || !email) {

            return res.send({
                status: 400,
                success: false,
                message: "Enter All Fields"
            })
        }

        const isValidEmail = await UserModel.findOne({ email });
        if (!isValidEmail) {
            return res.send({
                success: false,
                status: 401,
                message: "User Not Found"
            })

        }

        const user = await UserModel.findOne({ email });
        let superAdmin = 0;
        if (email === SUPER_ADMIN) {
            superAdmin = 1;
        }

        const isVerified = user.verified;
        if (!isVerified) {
            return res.send({
                success: true,
                status: 201,
                message: "Wait for the admin to verify or contact at " + process.env.CONTACT,
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send({
                success: false,
                status: 401,
                message: "Invalid credentials",
                superAdmin: superAdmin
            })
        }
        const token = jwt.sign(
            { id: user._id, college: user.name, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
        );


        return res.send({
            status: 200,
            success: true,
            message: "User logged in Successfully",
            token: token,
            superAdmin: superAdmin
        })


    } catch (error) {
        console.log(error)
    }
}

module.exports = { register, login };