const db = require('../connection/connection')
const express = require("express")

const update = (req,res)=> {
    const {student_id} = req.params

    const {full_name,email} = req.body
    // const student_id = req.params
      const query = `
    UPDATE students 
    SET full_name = coalesce(?,full_name), email = coalesce(?,email)
    WHERE student_id = ?
  `

    db.query(query,[full_name,email,student_id],(err,results)=>{
        if(err){
            console.log(`internal server error`)
            return res.status(500).json({message:`internal server error`,err})
        }else{
            console.log(results)
            return res.status(200).json({message:`user details updated successfully`})
        }
    })
}
module.exports={
    update
}