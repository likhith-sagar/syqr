const express = require('express');
const authRouter = require('./Routes/authRouter');
const dataRouter = require('./Routes/dataRouter');
const cookieParser = require('cookie-parser');
const config = require("./config.json");
const mongoose = require("mongoose");
const authVerify = require('./Middlewares/authVerify');


const app = express();

mongoose.connect(config.DB_URI,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},(err)=>{
    if(err)
        console.log("DB error", err);
    else
    app.listen(5500,()=>{
        console.log('listening at 5500');
    });
});

//to allow access for all urls
const corsMidware = (req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','*');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
}
app.use(express.json());
app.use(corsMidware);
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.json({status: 'test'});
});



app.use(authRouter);
app.use(dataRouter);

