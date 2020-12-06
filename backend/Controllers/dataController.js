const Qr = require("../Models/Qr");
const config = require("../config.json")

function handleErrors(err){
    const errors = {
        custom: "",
        url: "",
        uid: "",
        active: "",
        typeNumber: ""
    }
    //our custom raised error
    if(err.code == "1234"){
        errors.custom = err.errors.custom;
        errors.url = err.errors.url;
        return errors;
    }
    //mongoose sends this whenever unique property isnt met
    if(err.code=="11000"){
        errors.custom = "name not available";
    } else {
        //errors due to other conditions
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}
async function createQr(req, res){
    let uid = req.user.id;
    let custom = req.body.custom;
    let url = req.body.url;
    let typeNumber = req.body.typeNumber;
    // console.log(custom, url, uid);
    try{
        let qrcode = await Qr.createQr(custom, url, uid, typeNumber);
        res.json({status: true, data: qrcode});
    }
    catch(e){
        res.json({status: false, errors: handleErrors(e)});
    }
}

async function getData(req, res){
    let uid = req.user.id;
    let data = await Qr.getQrs(uid);
    res.json({status: true, data, user: req.user, baseUrl: config.BASE_URL});
}

async function deleteQr(req, res){
    let id = req.body.id;
    let uid = req.user.id;
    let data = await Qr.deleteQr(id, uid);
    res.json({status: true, data});
}

async function updateQr(req, res){
    let id = req.body.id;
    let uid = req.user.id;
    if(req.body.url && !req.body.url.match(/^https?:\/\/[a-zA-Z0-9_\?=\-\+\.\&\/%]*$/)){
        res.json({status: false});
        return;
    }
    if((req.body.active != null) || req.body.url){
        await Qr.updateQr(id, uid, req.body);
        res.json({status: true});
    } else {
        res.json({status: false});
    }
}

module.exports = {getData, createQr, deleteQr, updateQr};