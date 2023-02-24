const fs = require('fs')
const Post = require('../model/Post')

const createPost = async (req,res) => {
    const {originalname,path} = req.file
    const parts = originalname.split('.')
    const ext = parts[parts.length-1]
    const newPath = path + '.' + ext
    fs.renameSync(path, newPath)

    const {title, summary, content} = req.body
    //Store post
    const postObject = {title, summary, content, cover: newPath}
    const post = await Post.create(postObject)
    res.json(post)
}

const uploadPost = async (req,res) => {
    res.json(await Post.find())
}
module.exports = {createPost, uploadPost}