import {loginValidation, registerValidation} from "./validations/auth.js";
import mongoose from 'mongoose'
import express from 'express'
import checkAuth from "./utils/checkAuth.js";
import * as userController from "./controllers/userController.js"

mongoose.connect(`mongodb+srv://admin:0043@cluster0.dbrql4y.mongodb.net/news?retryWrites=true&w=majority`).then(() => console.log('DB is working')).catch(err => console.log(err))



const app = express()
const port = 3005

const jsonMiddleware = express.json()

app.use(jsonMiddleware)

app.get('/', (req, res) => {
    res.send("OK")
})

app.post('/login',loginValidation,userController.login )

app.post('/register',registerValidation,userController.register)
app.get('/me',checkAuth, userController.getMe)

app.listen(port, () => {
    console.log("Server started")
})
