//jshint esversion:6
import 'dotenv/config';
import express from 'express';
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

const app= express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User =new  mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
    res.render('home');
});

app.get("/login",(req,res)=>{
    res.render('login.ejs');
});

app.get("/register",(req,res)=>{
    res.render('register.ejs');
});

app.post("/register",(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
    .then(() => {
        res.render("secrets");
    })
    .catch((err) => {
        console.error(err);
    });
});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser && foundUser.password === password) {
            res.render("secrets");
            } else {
            // Handle case where user was not found or password doesn't match
            // You can send an error response or redirect to a login page
            }
        })
         .catch((err) => {
             console.error(err);
        });
});


app.listen(3000,function(){
    console.log("Server started on port 3000.");
});
