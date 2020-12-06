const {Schema, model} = require("mongoose");

qrSchema = new Schema({
    custom: {
        type: String,
        required: [true, "required"],
        minlength: [3,"min 3 letters required"],
        unique: true
    },
    url: {
        type: String,
        required: [true, "required"]
    },
    uid: {
        type: String,
        required: [true, 'required']
    },
    typeNumber: {
        type: Number,
        required: [true, 'required']
    },
    active: {
        type: Boolean,
        default: true
    },
    clicks: {
        type: Number,
        default: 0
    }
});

qrSchema.statics.createQr = async function(custom, url, uid, typeNumber){
    //todo: check if url is valid
    //optional: verify if url is safe
    let errors = {
        custom: "",
        url: ""
    }
    let error = false;
    if(!custom.match(/^[a-zA-Z0-9_]*$/)){
        errors.custom = "invalid short-link";
        error = true;
    }
    if(!url.match(/^https?:\/\/[a-zA-Z0-9_\?=\-\+\.\&\/%]*$/)){
        errors.url = "invalid url";
        error = true;
    }
    if(error){
        throw {code: "1234", errors};
    }
    let doc = await this.create({
        custom, url, uid, typeNumber
    });
    return doc;
}

qrSchema.statics.deleteQr = async function(id, uid){
    let res = await this.deleteOne({_id: id, uid});
    return res;
}
qrSchema.statics.getQrs = async function(uid){
    let res = await this.find({uid: uid});
    return res;
}
qrSchema.statics.updateQr = async function(id, uid, {active, url}){
    let res;
    if((active != null) && url){
        res = await this.updateOne({_id: id, uid}, {
            $set: {active, url}
        });
    }        
    return res;
}

qrSchema.statics.deleteAll = async function(uid){
    let res = await this.deleteMany({uid});
    return res;
}


const Qr = model("qr", qrSchema);

module.exports = Qr;
