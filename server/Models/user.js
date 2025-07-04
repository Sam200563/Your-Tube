import mongoose from "mongoose";

const userschema=mongoose.Schema({
    email:{type:String,require:true},
    isPremium:{type:Boolean,default:false},
    planName:{type:String,default:'Free'},
    planType:{type:String,default:'general'},
})

export default mongoose.model("user",userschema)