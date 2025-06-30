import mongoose from "mongoose";
import plan from './Models/plan.js'
import dotenv from 'dotenv'

dotenv.config();

mongoose.connect(process.env.DB_URL)

plan.insertMany([
    {name:'Free' ,durationMinutes:5, price :0},
    {name:'Bronze',durationMinutes:7,price: 10},
    {name:'Silver',durationMinutes:10,price: 50},
    {name:'Gold',durationMinutes:9999,price:100},
]).then(()=>{
    console.log("plans inserted")
    mongoose.disconnect();
})