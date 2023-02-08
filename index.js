import {loginValidation, registerValidation} from "./validations/auth.js";
import mongoose from 'mongoose'
import express from 'express'
import checkAuth from "./utils/checkAuth.js";
import * as userController from "./controllers/userController.js"
import * as postController from "./controllers/postController.js"
import {postCreateValidation} from "./validations/post.js";
import multer from 'multer'
import handleValidationErrors from "./validations/handleValidationErrors.js";

mongoose.connect(`mongodb+srv://admin:0043@cluster0.dbrql4y.mongodb.net/news?retryWrites=true&w=majority`).then(() => console.log('DB is working')).catch(err => console.log(err))


const app = express()
const port = 3005


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

app.use('/upload', express.static('uploads'))
const upload = multer({storage})

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.originalname}`
    })
})

const jsonMiddleware = express.json()

app.use(jsonMiddleware)

app.get('/', (req, res) => {
    res.send("OK")
})

app.post('/login', loginValidation, handleValidationErrors, userController.login)

app.post('/register', registerValidation, handleValidationErrors, userController.register)
app.get('/me', checkAuth, userController.getMe)


app.get('/posts', postController.getAll)
app.get('/posts/:id', postController.getPost)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.create)
app.delete('/posts/:id', checkAuth, postController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, postController.update)


app.listen(port, () => {
    console.log("Server started")
})
