import express from 'express'
import axios from 'axios'
const router = express.Router()

router.get("/google/userinfo",async(req,res)=>{
    const {access_token} = req.query
    if(!access_token){
        return res.status(400).send({error:'Access token is required'})
    }
    try {
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
        )
        res.json(response.data)
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
})

export default router;