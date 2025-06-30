import mongoose from 'mongoose'

const planschema=mongoose.Schema({
    name:{type:String,require:true,unique:true},
    durationMinutes:Number,
    price: Number
});

export default mongoose.model('Plan',planschema);