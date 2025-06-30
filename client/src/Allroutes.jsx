import React from "react";
import { Routes, Route,  } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Search from "../src/Pages/Search/Search";
import Videopage from "./Pages/Videopage/Videopage";
import Channel from "./Pages/Channel/Channel";
import Library from "./Pages/Library/Library";
import Likedvideo from "./Pages/Likedvideo/Likedvideo";
import Watchhistory from "./Pages/Watchhistory/Watchhistory";
import Watchlater from "./Pages/Watchlater/Watchlater";
import Yourvideo from "./Pages/Yourvideo/Yourvideo";
import Planupgrade from "./component/Planupgrade/Planupgrade";
import Download from "./Pages/Downloadvideo/Downloadvideo"
import { useSelector } from "react-redux";
import VideoCall from "./component/Videocall/Videocall";
const Allroutes = ({ seteditcreatechanelbtn, setvideouploadpage }) => {
  const currentuser=useSelector((state)=>state.currentuserreducer)
  const user={
    _id: currentuser?.result?._id,
    email: currentuser?.result?.email
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search/:searchquery" element={<Search />} />
      <Route path="/videopage/:vid" element={<Videopage />} />
      <Route path="/Library" element={<Library />} />
      <Route path="/Likedvideo" element={<Likedvideo />} />
      <Route path="/Watchhistory" element={<Watchhistory />} />
      <Route path="/Watchlater" element={<Watchlater />} />
      <Route path="/Download" element={<Download />}/>
     
      <Route path="/Videocall" element={<VideoCall />}/>
      <Route path="/Yourvideo" element={<Yourvideo />} />
      <Route path="/Upgradeplan" element={<Planupgrade user={user}/>}/>
      <Route path="/channel/:cid" element={ <Channel seteditcreatechanelbtn={seteditcreatechanelbtn} setvideouploadpage={setvideouploadpage}/>}/>
    </Routes>
  );
};

export default Allroutes;
