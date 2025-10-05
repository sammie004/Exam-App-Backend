const express = require('express')
const router = express.Router()

const {deleteAccount} = require('../deleteAccount/delete')

router.delete('/:student_id',deleteAccount)

module.exports = router