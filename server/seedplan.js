import mongoose from "mongoose";
import plan from './Models/plan.js';
import dotenv from 'dotenv';

dotenv.config();
await mongoose.connect(process.env.DB_URL);

const plans = [
  { name: 'Free', durationMinutes: 5, price: 0, planType: 'general' },
  { name: 'Bronze', durationMinutes: 7, price: 10, planType: 'general' },
  { name: 'Silver', durationMinutes: 10, price: 50, planType: 'general' },
  { name: 'Gold', durationMinutes: 9999, price: 100, planType: 'general' },
  { name: 'Premium Download', durationMinutes: 9999, price: 50, planType: 'download' }
];

for (const p of plans) {
  const exists = await plan.findOne({ name: p.name });
  if (!exists) {
    await plan.create(p);
    console.log(`Inserted: ${p.name}`);
  } else {
    console.log(` Skipped (already exists): ${p.name}`);
  }
}

mongoose.disconnect();
