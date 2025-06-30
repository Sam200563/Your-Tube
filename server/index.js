import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyparser from "body-parser";
import videoroutes from "./Routes/video.js"
import userrouttes from "./Routes/User.js";
import path from 'path'
import commentroutes from './Routes/comment.js'
import upgradePlanRoute from './Routes/upgradeplan.js'
import userplanroute from './Routes/userplan.js'
import userroutes from './Routes/auth.js'
import http from "http"
import {Server} from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app)
const io =new Server(server,{
  cors:{
    origin:'*',
    methods:['GET','POST'],
  }
})

app.use(cors());
app.use(express.json())
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use('/uploads',express.static(path.join('uploads')))

app.get("/", (req, res) => {
  res.send("Your tube is working");
});

app.use(bodyparser.json());
app.use("/auth",userroutes);
app.use("/user", userrouttes);
app.use("/video",videoroutes)
app.use("/comment",commentroutes)
app.use('/api/upgrade',upgradePlanRoute)
app.use('/api/userplan',userplanroute)
const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const DB_URL = process.env.DB_URL;
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Mongodb Database connected");
  })
  .catch((error) => {
    console.log(error);
  });
const users={}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register-user", (username) => {
    users[username]=socket.id
    console.log("Registered:",username)
    io.emit("user-list",Object.keys(users))
  });

  socket.on("call-user", ({ targetUsername, offer, fromSocketId }) => {
  const targetSocketId = users[targetUsername];
  if (targetSocketId) {
    io.to(targetSocketId).emit("receive-call", { offer, fromSocketId });
  }
});

  socket.on("answer-call", ({targetSocketId,answer}) => {
    io.to(targetSocketId).emit("call-answered",{answer})
  });

  socket.on("ice-candidate", ({targetSocketId,candidate}) => {
    io.to(targetSocketId).emit("ice-candidate",{candidate})
  });

  socket.on("end-call",({targetSocketId})=>{
    if(targetSocketId){
      io.to(targetSocketId).emit("call-ended")
    }
    socket.emit("call-ended")
  })

  socket.on("disconnect", () => {
    const username=Object.keys(users).find((key)=>users[key]===socket.id)
    if(username){
      delete users[username]
      io.emit("user-list",Object.keys(users))
    }
    console.log("User disconnected:", socket.id);
  });
});
server.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
