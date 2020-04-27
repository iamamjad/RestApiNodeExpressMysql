# RestApiNodeExpressMysql


Import the express 

const express = require('express');
const app = express();
const path = require('path');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// set static folder

app.use(express.static(path.join(__dirname,'public')));

app.use('/api/transactions',require('./routes/api/transactions'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));

