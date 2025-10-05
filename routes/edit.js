const express = require('express')
const router = express.Router()

const{update} = require('../edit-info/edit.js')

router.put ('/:student_id',update)

module.exports = router