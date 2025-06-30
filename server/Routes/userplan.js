import express from 'express'
import UserPlan from '../Models/userplan.js'
import Plan from '../Models/plan.js'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/:userId',async (req,res)=>{
  try {
    const {userId} =req.params;
    if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({error:'Invalid userID'})
    }
    const userPlan=await UserPlan.findOne({userId}).populate('planId')
    if(!userPlan || !userPlan.planId){
      return res.status(404).json({error:'User not found'})
    }
    res.json({
      planName:userPlan.planId.name,
      durationMinutes:userPlan.planId.durationMinutes
    })
  } catch (error) {
    console.error('Failed to fetch user plan:',error)
    res.status(500).json({error:'Server Error'})
  }
})

router.post('/assign-free/:userId',async(req,res)=>{
  try {
    const {userId}=req.params;
    const existing = await UserPlan.findOne({userId})
    if(existing) return res.status(200).json({message:'Already has plan'});

    const freePlan=await Plan.findOne({name:'Free'})
    if(!freePlan) return res.status(500).json({error:'Free plan not found'});

    await UserPlan.create({
      userId,
      planId:freePlan._id,
      purchaseDate:new Date()
    })
    res.status(201).json({message:'Free plan assigned'})

  } catch (error) {
    console.error('Failed to assign free plan:',err);
    res.status(500).json({error:'Server error'})
  }
});

export default router;