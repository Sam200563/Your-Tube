import mongoose from "mongoose";

const userplanSchema=mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    planId:{type:mongoose.Schema.Types.ObjectId, ref:'Plan'},
    purchaseDate:{type: Date,default:Date.now},
    expiryDate:{type:Date}
});

export default mongoose.model('Userplan',userplanSchema)