const db = require('../connection/connection')
const express = require('express')
const app = express()


const deleteAccount = (req,res)=>{
    const student_id = req.params
    const query = `delete from students where student_id = ?`
    db.query(query,[student_id],(err,results)=>{
        if(err){
            console.log(err)
            return res.status(500).json({message:`internal server error`})
        }else{
            console.log(`account deleted successfully`)
            return res.status(200).json({message:`account deleted successfully`,results})
        }
    })
}

module.exports={deleteAccount}