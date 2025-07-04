import logo from "./logo.svg";
import "./App.css";
import React ,{ useEffect, useState } from "react";
import Navbar from "./component/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import Drawersliderbar from "./component/Leftsidebar/Drawersliderbar";
import Allroutes from "../src/Allroutes";
import Createeditchannel from "./Pages/Channel/Createeditchannel";
import Videoupload from "./Pages/Videoupload/Videoupload";
import { fetchallchannel } from "./Action/channeluser";
import { getallvideo } from "./Action/video";
import { getallcomment } from "./Action/comment";
import { getallhistory } from "./Action/history";
import { getalllikedvideo } from "./Action/likedvideo";
import { getallwatchlater } from "./Action/watchlater";
import { getalldownload } from "./Action/download";
import { useDispatch } from "react-redux";
function App() {
  const [toggledrawersidebar, settoggledrawersidebar] = useState({
    display: "none",
  });
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(fetchallchannel())
    dispatch(getallvideo())
    dispatch(getallcomment())
    dispatch(getallhistory())
    dispatch(getalllikedvideo())
    dispatch(getallwatchlater())
    dispatch(getalldownload())
  },[dispatch])
  const toggledrawer = () => {
    if ((toggledrawersidebar.display === "none")) {
      settoggledrawersidebar({
        display: "flex",
      });
    } else {
      settoggledrawersidebar({
        display: "none",
      });
    }
  };
  const [editcreatechanelbtn, seteditcreatechanelbtn] = useState(false);
  const [videouploadpage, setvideouploadpage] = useState(false);
  return (
    <Router>
      {
        videouploadpage && <Videoupload setvideouploadpage={setvideouploadpage}/>
      }
      {editcreatechanelbtn &&(
        <Createeditchannel seteditcreatechanelbtn={seteditcreatechanelbtn}/>
      )}
      <Navbar
        seteditcreatechanelbtn={seteditcreatechanelbtn}
        toggledrawer={toggledrawer}
      />
      <Drawersliderbar toggledraw={toggledrawer} toggledrawersidebar={toggledrawersidebar}/>
      <Allroutes seteditcreatechanelbtn={seteditcreatechanelbtn} setvideouploadpage={setvideouploadpage}/>
    </Router>
  );
}

export default App;
