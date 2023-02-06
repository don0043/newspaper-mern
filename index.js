import {registerValidation} from "./validations/auth.js";
import {validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import express from 'express'
import userModel from './models/user.js'

mongoose.connect(`mongodb+srv://admin:0043@cluster0.dbrql4y.mongodb.net/news?retryWrites=true&w=majority`).then(() => console.log('DB is working')).catch(err => console.log(err))



const app = express()
const port = 3005

const jsonMiddleware = express.json()

app.use(jsonMiddleware)

app.get('/', (req, res) => {
    res.send("OK")
})
app.post('/login',registerValidation,async (req, res) => {
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
})


app.listen(port, () => {
    console.log("Server started")
})
