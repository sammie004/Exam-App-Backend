// dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

// routes
const router = require('./routes/userAuth');
const questionRoutes = require('./routes/questions');
const examRoutes = require('./routes/exam');
const subjectRoutes = require('./routes/subjects')
const results = require('./routes/results')
const deleteaccount = require('./routes/delete')
const edit = require('./routes/edit')

// usages
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get('/',(req,res)=>{
    res.send('Hello World!');
})
app.use('/api',router);
app.use('/questions',questionRoutes);
app.use('/exam',examRoutes);
app.use('/get-subject',subjectRoutes)
app.use('/delete',deleteaccount)
app.use('/get-results',results)
app.use('/edit-info',edit)


// port
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});