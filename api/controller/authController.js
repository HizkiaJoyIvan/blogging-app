const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req,res) => {
    const {username, password} = req.body

    //Confirm user
    if(!username || !password){
        return res.status(400).json({message: 'All fields are required'})
    } 

    //Hash password
    const salt = bcrypt.genSaltSync(10)
    const hashedPwd = bcrypt.hashSync(password, salt)

    //Store a new user
    const userObject = {username, 'password': hashedPwd}
    const user = await User.create(userObject)
    
    if(user){
        return res.status(200).json({message: `User ${username} has been created`})
    } return res.status(400).json({message: 'Invalid user data'})
}

const login = async (req,res) => {
    const {username, password} = req.body
    const userDoc = await User.findOne({username})

    if(!userDoc) {
        return res.status(400).json({message: 'User not found'})
    }

    const isPwdCorrect = await bcrypt.compare(password, userDoc.password)

    if(!isPwdCorrect){
        return res.status(400).json({message: 'Wrong password'})
    }

    jwt.sign({username, id:userDoc._id}, process.env.JWT, {}, (err, token)=>{
        if(err) throw err
        res.cookie('token', token).json('ok')
    })

}

const profile = async (req,res) => {
    const {token} = req.cookies
    jwt.verify(token, process.env.JWT, {}, (err,info) => {
        if(err) throw err
        res.json(info)
    })

}

const logout = async (req,res) => {
    res.cookie('token', '').json('ok')
}

module.exports = {
    register,
    login,
    profile,
    logout
}