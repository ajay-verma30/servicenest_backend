const express = require('express');
const morgan = require('morgan');
const app = express()
const cors = require('cors');

//defining morgan:
morgan.token('host', function(req,res){
    return req.hostname;
})



//mmiddlewares
app.use(express.json())
app.use(cors());
app.use(morgan(':method :host :status :res[content-length] - :response-time ms'));
app.use('/ticket', require('./routes/tickets'));
app.use('/users', require('./routes/users'));


app.get('/', (req,res)=>{
    res.send("This is a test")
})


const port = process.env.PORT || 3001
app.listen(port)