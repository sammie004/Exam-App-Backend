const db = require('../connection/connection')
const express = require('express')
const app = express()

const checkValidity = (req,res) =>{
    const student_id = req.params.student_id
    const search =  `
    SELECT 
      er.result_id, er.student_id, er.score, er.total_questions, 
      er.percentage, er.taken_at,
      s.name AS subject_name, s.code AS subject_code
    FROM exam_results er
    JOIN subjects s ON er.subject_id = s.subject_id
    WHERE er.student_id = ?`;
    db.query(search,[student_id],(err,results)=>{
        if(err){
            console.log(err)
            return res.status(500).json({message:`internal server error`, err})
        }
        if(results.length === 0){
            console.log(`no results found for this user`)
            return res.status(404).json({message:`no results found for this user with id ${student_id}`})
        }else{
            console.log(results)
            return res.status(200).json({message:results})
        }
    })
}
module.exports = {checkValidity}