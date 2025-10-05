const express = require("express")
const router = express.Router()
const {checkValidity} = require('../results/results')

router.get('/:student_id',checkValidity)

module.exports = router