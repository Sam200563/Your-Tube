import mongoose from "mongoose";

const userschema=mongoose.Schema({
    email:{type:String,require:true},
    isPremium:{type:Boolean,default:false},
})

export default mongoose.model("user",userschema)