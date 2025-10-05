const db = require('../connection/connection');
const express = require('express')
const app = express()

const GetSubject = (req,res)=>{
    const lecturer_id = req.params.lecturer_id
    const query = 'select * from subjects where lecturer_id = ?'
    db.query(query,[lecturer_id],(err,results)=>{
        if(err){
            console.log(err)
            return res.status(500).json({message:'internal server error'})
        }
        if(results.length === 0){
            console.log(`no subjects found for this lecturer`)
            return res.status(404).json({message:`no subjects found for this lecturer`})
        }else{
            console.log(results)
            return res.status(200).json({results})
        }
    })
}
const FBD = (req,res)=>{
    const department = req.params.department
    const query = 'select * from subjects where department = ?'
    db.query(query,[department],(err,results)=>{
        if(err){
            console.log(err)
            return res.status(500).json({message:`${err}`})
        }else if (results.length === 0){
            console.log(`no subjects found for this department \n kindly wait while subjects are being uploaded`)
            return res.status(404).json({message:`no subject found \n\n please wait, subjects are being uploaded`})
        }else{
            console.log(results)
            return res.status(200).json({results})
        }
    })
}
module.exports = {
    GetSubject,
    FBD
}