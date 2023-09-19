const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id)=>{
    const jwt_secret_key = process.env.JWT_KEY;
    return jwt.sign({_id} ,jwt_secret_key ,{expiresIn:"10d"});
}

const registerUser = async(req,res)=>{
    try{
        const { name ,email ,password } = req.body;
    
        let user = await userModel.findOne({email});
        
        if(user)
            return res.status(400).json("Email already used.");
        
        if(!name || !email || !password)
            return res.status(400).json("All fields are required...");

        if(!validator.isEmail(email))
            return res.status(400).json("Email isn't valid...");

        if(!validator.isStrongPassword(password))
            return res.status(400).json("Password must be strong...");

        user = new userModel({name ,email ,password});

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password ,salt);

        await user.save();

        const token = createToken(user._id);
        res.status(200).json({_id:user._id ,name ,email ,token});
    }catch(err){
        console.error(err);
        res.status(500).json(err)
    }
}

const loginUser = async(req,res)=>{
    const { email ,password } = req.body;
    try{
        let user = await userModel.findOne({email});
        if(!user)
            return res.status(400).json("Invalid email or password...");
        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid)
            return res.status(400).json("Invalid email or password...");

        const token = createToken(user._id);
        res.status(200).json({_id:user._id ,name:user.name ,email ,token});
    }catch(err){
        console.error(err);
        res.status(500).json(err);
    }
}

const findUser = async(req,res)=>{
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId);
        res.status(200).json(user);
    }catch(err){
        console.error(err);
        res.status(500).json(err);
    }
}

const getUsers = async(req,res)=>{
    try{
        const users = await userModel.find();
        res.status(200).json(users);
    }catch(err){
        console.error(err);
        res.status(500).json(err);
    }
}
module.exports = {registerUser ,loginUser ,findUser ,getUsers};