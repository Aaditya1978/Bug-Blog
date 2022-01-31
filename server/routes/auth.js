const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const saltRounds = parseInt(process.env.SALT_ROUNDS);


Router.post("/register", async(req, res) => {
    const {name, email, password} = req.body;

    const user = await User.findOne({email});
    if(user){
        return res.status(400).send({error: "User already exists"});
    }
    bcrypt.hash(password, saltRounds, async(err, hash) => {
        if(err){
            return res.status(500).send({error: "Internal server error"});
        }
        try{
            const newUser = await User.create({name, email, password: hash});
            return res.status(201).send({user: newUser});
        }
        catch(err){
            return res.status(500).send({error: "Internal server error"});
        }
    });
});


Router.post("/login", async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).send({error: "User not found"});
    }

    bcrypt.compare(password, user.password, async(err, result) => {
        if(err){
            return res.status(500).send({error: "Internal server error"});
        }
        if(!result){
            return res.status(401).send({error: "Invalid credentials"});
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "6h"});
        return res.status(200).send({token});
    });
});


module.exports = Router;