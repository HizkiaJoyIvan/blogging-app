require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3200
const authController = require('./controller/authController')
const userController = require('./controller/userController')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/connectDB')
const { default: mongoose } = require('mongoose')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

//Connect to MongoDB
connectDB() 

app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000'
}))

app.use(express.json())

app.use(cookieParser())


app.post('/register', authController.register)

app.post('/login', authController.login)

app.get('/profile', authController.profile)

app.post('/logout', authController.logout)

app.post('/create', upload.single('file'), userController.createPost)

app.get('/post', userController.uploadPost)

mongoose.connection.once('open', ()=> {
    console.log('Connected to MongoDB')
    app.listen(PORT, ()=> {
        console.log(`Server is listening on http://localhost:${PORT}`)
    })
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})