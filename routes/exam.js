const express= require('express');
const router = express.Router();

const {submitExam} = require('../examination/takeExam')

router.post('/submit-exam',submitExam)
module.exports = router;