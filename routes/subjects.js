const express = require('express')
const router = express.Router()

const{GetSubject,FBD} = require('../subjects/subjects')
router.get('/:lecturer_id',GetSubject)
router.get('/get-by/:department',FBD)

module.exports = router