const mongoose = require('mongoose');
const userSchema=new mongoose.Schema({
    name:{type:String , required:true },
    email:{type: String, required:true},
    password:{type:String ,required:true},
    verifyotp:{type:String,default:''},
    verifyotpexpireAt:{type: Number, default:0},
    isAcconuntVerified:{type:Boolean,default:false},
    resetOtp:{type:String,default:''},
    resetOtpExpireAt:{type : Number,default:0},
    isAdmin: { type: Boolean, default: false }
})
const userModel = mongoose.models.user || mongoose.model('user',userSchema)


module.exports = userModel;

