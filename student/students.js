const db = require('../connection/connection');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express()
app.use(express.json());

const signup = (req,res) =>{
    const {full_name,email,password,department} = req.body
    if(!full_name || !email || !password || !department){
        return res.status(400).json({message:'All fields are required'});
    }
    const checkUserQuery = 'SELECT * FROM students WHERE email = ?';
    db.query(checkUserQuery,[email],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:'Database error'});
        }else if(result.length > 0){
            console.log('User already exists');
            return res.status(400).json({message:'User already exists'});
        }
        const hashedPassword = bcrypt.hashSync(password,10);
        const insertUserQuery = 'INSERT INTO students (full_name,email,password,department) VALUES (?,?,?,?)';
        db.query(insertUserQuery,[full_name,email,hashedPassword,department],(err,result)=>{
            if(err){
                console.log(err);
                return res.status(500).json({message:'Database error'});
            }
            else{
                console.log('User registered successfully');
                return res.status(201).json({message:'User registered successfully'});
            }
    })
}
)}
const Login = (req,res) =>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({message:'All fields are required'});
    }
    const getUserQuery = 'SELECT * FROM students WHERE email = ?';
    db.query(getUserQuery,[email],(err,result)=>{
        if(err){
            console.log(err)
            return res.status(500).json({message:'Database error'});
        }else{
            if(result.length === 0){
                console.log(`this user does not exist!`)
                return res.status(400).json({message:'User does not exist'});
            }
            const user = result[0]
            const isMatch = bcrypt.compareSync(password,user.password);
            if(!isMatch){
                console.log('Invalid credentials');
                return res.status(400).json({message:'Invalid credentials'});
            }else{
                console.log('Login successful');
                const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1h'});
                return res.status(200).json({message:'Login successful',token,Username:user.full_name,student_id:user.student_id,email:user.email,department:user.department});
            }
        }
    })
}
module.exports = {
    signup,
    Login
};