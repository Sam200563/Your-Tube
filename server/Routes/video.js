import express from "express";
import { likevideocontroller } from "../Controllers/like.js";
import { viewscontroller } from "../Controllers/views.js";
import { uploadvideo, getallvideos } from "../Controllers/video.js";
import {historycontroller,deletehistory,getallhistorycontroller,} from "../Controllers/History.js";
import {watchlatercontroller,getallwatchlatervontroller,deletewatchlater,} from "../Controllers/watchlater.js";
import {likedvideocontroller,getalllikedvideo,deletelikedvideo,} from "../Controllers/likedvideo.js";
import {downloadcontroller,getalldownloadcontroller,deletedownload,} from "../Controllers/download.js";
import upload from "../Helper/filehelper.js";
import auth from "../middleware/auth.js";
import Razorpay from "razorpay"
import user from "../Models/user.js";
const routes = express.Router();

routes.post("/uploadvideo", auth, upload.single("file"), uploadvideo);

routes.get("/getvideos", getallvideos);
routes.patch("/like/:id", auth, likevideocontroller);
routes.patch("/view/:id", viewscontroller);

routes.post("/history", auth, historycontroller);
routes.get("/getallhistory", getallhistorycontroller);
routes.delete("/deletehistory/:userid", auth, deletehistory);

routes.post("/watchlater", auth, watchlatercontroller);
routes.get("/getallwatchlater", getallwatchlatervontroller);
routes.delete("/deletewatchlater/:videoid/:viewer", auth, deletewatchlater);

routes.post("/likevideo", auth, likedvideocontroller);
routes.get("/getalllikevide", getalllikedvideo);
routes.delete("/deletelikevideo/:videoid/:viewer", auth, deletelikedvideo);

routes.post("/download", auth, downloadcontroller);
routes.get("/getalldownload", getalldownloadcontroller);
routes.delete("/deletedownload/:videoid/:viewer", auth, deletedownload);


const razorpay = new Razorpay({
  key_id: "rzp_test_QwSuYItlzKmHNj", // Replace with your test key
  key_secret: "nWVfKsBs9IqISW6JzTGVFhhf"
});

// Create Razorpay order
routes.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
});

// Mark user as premium
routes.post("/upgrade", async (req, res) => {
  const { userId,planName,planType='general' } = req.body;
  try {
    await user.findByIdAndUpdate(userId, { isPremium: true,planName,planType });
    res.status(200).json({success:true, message: "User upgraded to premium" });
  } catch (err) {
    res.status(500).json({ message: "Upgrade failed", error: err.message });
  }
});

export default routes;
