const express = require("express");
const mongoose = require("mongoose");
const config = require("./config.json");

const app = express();

let qr_collection = null;

mongoose.connect(config.DB_URI,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},async (err)=>{
    if(err)
        console.log("DB error", err);
    else {
        qr_collection = await mongoose.connection.collection("qrs");
        app.listen(5555,()=>{
            console.log('listening at 5555');
        });
    }
});

app.get("/:custom", async (req,res)=>{
    let doc = await qr_collection.findOne({custom: req.params.custom});
    if(doc && doc.active){
        res.redirect(doc.url);
        qr_collection.updateOne({_id: doc._id}, {
            $inc: {clicks: 1}
        });
    } else {
        res.sendFile(__dirname +"/404.html");
    }
});

