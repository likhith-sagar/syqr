const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const config = require("../config.json");


function handleErrors(err){
    const errors = {
        name: "",
        email: "",
        password: ""
    }
    //we send this in case to handle errors during login
    if(err.code=="12000"){
        errors.email = err.email;
        errors.password = err.password;
        return errors;
    }
    //mongoose sends this whenever unique property isnt met
    if(err.code=="11000"){
        errors.email = "Email already exists";
    } else {
        //errors due to other conditions
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

async function generateToken(id, email, name, remember){
    let payload = {
        id, email, name
    };
    return jwt.sign(payload, config.SECRET_KEY, {
        expiresIn: remember?config.JWT_LIFE:config.JWT_TEMP
    });
}
async function isLoggedIn(req, res){
    res.json({status: true, user: req.user});
    return;
}
async function signUserUp(req, res){
    try{
        let user = await User.create(req.body);
        res.json({status: true});
    }
    catch(err){
        res.send({status: false, errors: handleErrors(err)});
    }
}
async function logUserIn(req, res){
    try{
        let user = await User.login(req.body.email, req.body.password);
        //generate a token
        let token = await generateToken(user._id, user.email, user.name);
        //set the token as cookie
        let options = new Object();
        if(req.body.remember){
            options.maxAge = config.JWT_LIFE*1000;
        }
        options.httpOnly = true;
        res.cookie(config.COOKIE_NAME,token,options);
        //send back request
        res.json({status: true, user:{id: user._id, name: user.name, email: user.email}});
    }
    catch(err){
        res.send({status: false, errors: handleErrors(err)});
    }
}
function logUserOut(req, res){
    res.cookie(config.COOKIE_NAME,'',{
        maxAge: 1
    });
    res.json({status: true});
}
async function deleteUser(req, res){
    let uid = req.user.id;
    try{
        await User.deleteUser(uid);
        res.cookie(config.COOKIE_NAME,'',{
            maxAge: 1
        });
        res.json({status: true});
    } catch(err){
        res.json({status: false, error: err});
    }
}

module.exports = {isLoggedIn, signUserUp, logUserIn, logUserOut, deleteUser};