const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const localStorage = require('localStorage')
const uploadMiddleware = multer({ dest: 'uploads/' })
const User = require('./models/User')
const Post = require('./models/Post')
const fs = require("fs");
const bodyParser = require('body-parser');

const secret = "dfsjbgjkfsgbfbg";
const salt = bcrypt.genSaltSync(10);

const app = express();
const router = express.Router();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());    
app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded)
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect("mongodb+srv://admin:admin@cluster0.37k554u.mongodb.net/?retryWrites=true&w=majority")

app.post("/register", async (req, res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e){
        res.status(400).json(e)
    }
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    let passOk = true;
    if(userDoc === null){
        passOk = false;
    }
    else{
        passOk = bcrypt.compareSync(password, userDoc.password);
    }
    if(passOk){
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        })
    }
    else{
        res.status(400).json("Wrong Credentials");
    }
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err){
            res.status(400).json({message: "Something is wrong"});
        }
        else{
            res.json(info);
        }
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    let isCorrect = true;
    if(req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newpath = path + '.' + ext;
        fs.renameSync(path, newpath);
        
        const {token} = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            let postDoc;
            if(err){
                isCorrect = false;
            }
            else{
                const{title, summary, content} = req.body;
                postDoc = await Post.create({
                    title,
                    summary,
                    content,
                    cover: newpath,
                    author: info.id,
                })
            }
            if(isCorrect){
                res.json(postDoc);
            }
            else{
                res.status(400).json({message: "Not logged in"});
            }
        })
    }
    else{
        const {token} = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            let postDoc;
            if(err){
                isCorrect = false;
            }
            else{                
                const{title, summary, content} = req.body;
                postDoc = await Post.create({
                    title,
                    summary,
                    content,
                    author: info.id,
                })
            }
            if(isCorrect){
                res.json(postDoc);
            }
            else{
                res.status(400).json({message: "Not logged in"});
            }
        })
    }
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newpath = null;
    let isAuthor = true;
    if(req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newpath = path + '.' + ext;
        fs.renameSync(path, newpath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        const{id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        if(err){
            isAuthor = false;
        }
        else{
            isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        }
        if(!isAuthor){
            return res.status(400).json('You are not the author');
        }
        await Post.findByIdAndUpdate(id, {
            title,
            summary,
            content,
            cover: newpath ? newpath : postDoc.cover,
        })

        res.json(postDoc);
    })
})

app.delete('/delete/:id', async (req, res) => {
    const{id, title, summary} = req.body;
    const {token} = req.cookies;
    let isCorrect = true;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err){
            isCorrect = false;
        }
        else{
            const vari = await Post.findById(req.params.id);
            isCorrect = JSON.stringify(vari.author) === JSON.stringify(info.id);
        }
        if(isCorrect){
            const deletePost = await Post.findByIdAndDelete(req.params.id);
            if(!deletePost){
                return res.status(404).json({message: "Post not found"});
            }
            res.json({message: "Post Deleted Successfully"});
        }
        else{
            res.status(400).json("You are not the owner");
        }
    })
})

app.get('/post', async (req, res) => {
    const posts = await Post.find()
                  .populate('author', ['username'])
                  .sort({createdAt: -1})
                  .limit(20);
    res.json(posts);
})

app.get('/delete/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

app.listen(4000, () => {
    console.log("Server started on port 4000");
});

// mongodb+srv://admin:admin@cluster0.37k554u.mongodb.net/?retryWrites=true&w=majority