const config = require("../config.json")
const jwt = require("jsonwebtoken");

function authVerify(req, res, next){
    let token = req.cookies[config.COOKIE_NAME];
    if(token){
        jwt.verify(token, config.SECRET_KEY,(err, data)=>{
            if(err){
                res.send({status: false, msg: "Token invalid"});
            } else {
                req.user = data;
                next();
            }
        });
    } else {
        res.send({status: false, msg: "Token not found"});
    }
}

module.exports = authVerify;