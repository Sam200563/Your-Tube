import express from "express";
import nodemailer from "nodemailer";
import Plan from "../Models/plan.js";
import UserPlan from "../Models/userplan.js";
import dotnev from "dotenv";
import User from "../Models/user.js";

dotnev.config();
const router = express.Router();

console.log("Upgradeplan.js loaded");
router.post("/", async (req, res) => {
  console.log("recived post /api/upgrade request");
  const { userId, planName, userEmail,planType='general' } = req.body;
  try {
    console.log("Starting upgrade for user:", userId);
    const plan = await Plan.findOne({ name: planName, planType });
    if (!plan) {
      console.log("plan not found:", planName);
      return res.status(404).json({ success: false, error: "plan not found" });
    }

    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      planName,
      planType,
    });
    const expiryDate =
      plan.name === "Gold"
        ? null
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const userPlan = await UserPlan.findOneAndUpdate(
      { userId },
      {
        planId: plan._id,
        expiryDate,
        purchaseDate: new Date(),
      },
      { upsert: true, new: true }
    );
    console.log("plan saved to userplan:", userPlan);

    if (planType === "general") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Your ${plan.name} Plan is Activated ✅`,
        html: `
    <div style="font-family: Arial, sans-serif; line-height:1.5; color:#333;">
      <h2 style="color:#007BFF; font-size:20px;">🎉 Congratulations!</h2>
      <p style="font-size:16px;">
        Thank you for purchasing the <strong>${plan.name}</strong> plan.
      </p>
      <div style="border:1px solid #007BFF; padding:15px; border-radius:5px; margin:20px 0;">
        <h3 style="color:#007BFF; font-size:18px; margin:0 0 10px 0;">
          Plan Details:
        </h3>
        <p style="margin:5px 0;"><strong>Duration:</strong> ${
          plan.durationMinutes === 9999
            ? "Unlimited"
            : plan.durationMinutes + " mins"
        }</p>
        <p style="margin:5px 0;"><strong>Price:</strong> ₹${plan.price}</p>
        <p style="margin:5px 0;"><strong>Valid until:</strong> ${
          expiryDate ? expiryDate.toLocaleDateString() : "Lifetime"
        }</p>
      </div>
      <p style="font-size:16px;">
        Enjoy your streaming experience!<br/>
        <em>– Your-Tube Team</em>
      </p>
    </div>
  `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent to :", userEmail);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Upgrade Error:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error during upgrade" });
  }
});

export default router;
