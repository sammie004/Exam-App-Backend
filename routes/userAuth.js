const express = require('express');
const router = express.Router();
const {signup,Login} = require('../lecturers/lecturers')
const {signup:studentSignup,Login:studentLogin} = require('../student/students')

router.post('/lecturer/signup',signup)
router.post('/lecturer/login',Login)
router.post('/student/signup',studentSignup)
router.post('/student/login',studentLogin)

module.exports = router;