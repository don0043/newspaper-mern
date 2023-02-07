import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json(errors.array())
        }
        const password = req.body.passwordHash
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new userModel({
            email: req.body.email,
            nickName: req.body.nickName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl
        })

        const user = await doc.save()
        const token = jwt.sign(
            {
                _id: user._id,
            },'tetradka2',
            {
                expiresIn: '30d'
            }
        )
        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    }catch (err){
        console.log(err)
        res.status(500).json({
            message: "registration failed"
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await userModel.findOne({email: req.body.email})
        if (!user){
            return res.status(404).json({message: "incorrect User"})
        }
        const isValidPass = await bcrypt.compare(req.body.passwordHash, user._doc.passwordHash)
        if (!isValidPass){
            return res.status(404).json({message: "incorrect User"})
        }
        const token = jwt.sign(
            {
                _id: user._id,
            },'tetradka2',
            {
                expiresIn: '30d'
            }
        )
        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    }catch (err){
        console.log(err)
        res.status(500).json({message: "authorization failed"})
    }
}

export const getMe = async (req,res) => {
    try {
        const user = await userModel.findById(req.userId)

        if (!user){
            return res.status(403).json({
                message: "user not found"
            })
        }

        const {passwordHash, ...userData} = user._doc

        res.json(userData)
    }catch (err){
        res.status(501).json({
            message: "not verified"
        })
    }
}
