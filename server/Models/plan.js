import mongoose from 'mongoose'

const planschema=mongoose.Schema({
    name:{type:String,require:true,unique:true},
    durationMinutes:Number,
    price: Number,
    planType:{type:String,default:'general'},
});

export default mongoose.model('Plan',planschema);