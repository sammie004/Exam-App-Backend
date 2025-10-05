const express = require('express');
const router = express.Router();

const {getBySubject,create,createBulk,getAllQuestions} = require('../examination/questions')
router.get('/questions/:subject_id/:department',getBySubject)
router.get('/questions',getAllQuestions)
router.post('/create-questions',create)
router.post('/questions/bulk',createBulk)
module.exports = router;