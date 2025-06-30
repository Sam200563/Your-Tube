import mongoose from "mongoose";

const downloadschema=mongoose.Schema({
    videoid:{type:String,require:true},
    date:{type:Date,default:Date.now()},
    viewer:{type:String,require:true},
})

export default mongoose.model('Download',downloadschema)