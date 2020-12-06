const {Schema, model} = require("mongoose");
const bcrypt = require("bcrypt");
const Qr = require("./Qr");

function isEmail(email){
    let regEx = /^[a-zA-Z0-9._]{1,}@[a-z0-9]{1,}.[a-z]{1,}$/;
    if(email.match(regEx)){
        return true;
    } else {
        return false;
    }
}

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "required"],
        minlength: [3,"min 3 letters required"]
    },
    email: {
        type: String,
        required: [true, "required"],
        unique: true,
        validate: [isEmail, "invalid Email"]
    },
    password: {
        type: String,
        required: [true, "required"],
        minlength: [6,"min length is six"]
    }
});

userSchema.pre("save",async function(next){
    let salt = await bcrypt.genSalt(5);
    let hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});

userSchema.statics.login = async function(email, password){
    let errors = {
        email: "",
        password: "",
        code: "12000"
    }
    let user = await this.findOne({email});
    if(user){
        let match = await bcrypt.compare(password, user.password);
        if(match){
            return user;
        }else{
            errors.password = "Invalid password";
        }
    } else {
        errors.email = "Account doesn't exists";
    }
    throw errors;
}
userSchema.statics.deleteUser = async function(uid){
    await Qr.deleteAll(uid);
    await this.deleteOne({_id: uid});
}

const User = model("user",userSchema);

module.exports = User;
