import express from "express"
import {login} from "../Controllers/Auth.js"
import { updatechaneldata,getallchanels } from "../Controllers/channel.js"
import User from "../Models/user.js"
const routes=express.Router()

routes.post('/login',login)
routes.patch('/update/:id',updatechaneldata)
routes.get('/getallchannel',getallchanels)

routes.get('/getuser/:id',async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message:'server error',error:error.message})
    }
})

export default routes;