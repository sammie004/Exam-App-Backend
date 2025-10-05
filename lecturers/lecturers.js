const db = require('../connection/connection');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express()
app.use(express.json());


// Lecturer signup
const signup = (req, res) => {
  const { full_name, email, password, department, subjects } = req.body;
  // subjects will be an array of { name, code }

  if (!full_name || !email || !password || !department || !subjects) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check duplicate lecturer
  const checkUserQuery = 'SELECT * FROM lecturers WHERE email = ?';
  db.query(checkUserQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'Lecturer already exists' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert lecturer
    const insertLecturerQuery =
      'INSERT INTO lecturers (full_name, email, password, department) VALUES (?,?,?,?)';
    db.query(
      insertLecturerQuery,
      [full_name, email, hashedPassword, department],
      (err, lecturerResult) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        const lecturer_id = lecturerResult.insertId;

        // Insert subjects linked to this lecturer
        const subjectValues = subjects.map((s) => [
          s.name,
          s.code,
          lecturer_id,
          department
        ]);

        const insertSubjectsQuery =
          'INSERT INTO subjects (name, code, lecturer_id,department) VALUES ?';
        db.query(insertSubjectsQuery, [subjectValues], (err) => {
          if (err) return res.status(500).json({ message: 'Database error inserting subjects' });

          return res.status(201).json({ 
            message: 'Lecturer and subjects registered successfully' 
          });
        });
      }
    );
  });
};

const Login = (req,res) =>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({message:'All fields are required'});
    }
    const getUserQuery = 'SELECT * FROM lecturers WHERE email = ?';
    db.query(getUserQuery,[email],(err,result)=>{
        if(err){
            console.log(err)
            return res.status(500).json({message:'Database error'});
        }else{
            if(result.length === 0){
                console.log(`this user does not exist!`)
                return res.status(400).json({message:'User does not exist'});
            }
            const user = results[0]
            const isMatch = bcrypt.compareSync(password,user.password);
            if(!isMatch){
                console.log('Invalid credentials');
                return res.status(400).json({message:'Invalid credentials'});
            }else{
                console.log('Login successful');
                const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1h'});
                return res.status(200).json({message:'Login successful',token,Username:user.full_name});
            }
        }
    })
}
module.exports = {
    signup,
    Login
};