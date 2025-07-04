import React, { useEffect, useState } from "react";
import "./Videopage.css";
import moment from "moment";
import { addPoints } from "../../Action/userPoints";
import Likewatchlatersavebtns from "./Likewatchlatersavebtns";
import { useParams, Link, useNavigate } from "react-router-dom";
import vidd from "../../component/Video/vid.mp4";
import Comment from "../../component/Comment/Comment";
import { useDispatch, useSelector } from "react-redux";
import { viewvideo } from "../../Action/video";
import { addtohistory } from "../../Action/history";
import Gesturevideoplayer from "../../component/GestureVideoPlayer/Gesturevideoplayer";
import axios from "axios";
const Videopage = () => {
  const { vid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [planDuration, setPlanDuration] = useState(5); // default to 5 mins

  const vids = useSelector((state) => state.videoreducer);
  const vv = vids?.data?.filter((q) => q._id === vid)[0];
  const currentuser = useSelector((state) => state.currentuserreducer);
  const handleviews = () => {
    dispatch(viewvideo({ id: vid }));
  };
  const handlehistory = () => {
    dispatch(
      addtohistory({
        videoid: vid,
        viewer: currentuser?.result._id,
      })
    );
  };

  const handleNextVideo = () => {
    const index = vids?.data?.findIndex((v) => v._id === vid);
    if (index !== -1 && vids?.data.length > 1) {
      const nextIndex = (index + 1) % vids.data.length;
      navigate(`/videopage/${vids.data[nextIndex]._id}`);
    }
    console.log("nextvideois open");
  };

  const handleShowComments = () => {
    const commentsection = document.getElementById("comment-section");
    if (commentsection) {
      commentsection.scrollIntoView({ behavior: "smooth" });
    }
    console.log("comment section is open");
  };

  const handleClose = () => {
    window.location.href = "/";
  };
  useEffect(() => {
    if (currentuser) {
      handlehistory();
    }
    handleviews();
  }, []);
  
  useEffect(()=>{
    const timer=setTimeout(()=>{
      dispatch(addPoints(5))
      console.log("5 points added for watching")
    },10000)
    return ()=>{clearTimeout(timer)}
  },[]);
  
  useEffect(()=>{
    const fetchPlan=async () =>{
      try {
        const res = await axios.get(`http://localhost:5000/api/userplan/${currentuser?.result._id}`)
        setPlanDuration(Number(res.data.durationMinutes))
      } catch (err) {
        if(err.response?.status === 404){
          try {
            await axios.post(`http://localhost:5000/api/userplan/assign-free/${currentuser?.result._id}`)
            const res = await axios.get(`http://localhost:5000/api/userplan/${currentuser?.result._id}`)
            setPlanDuration(res.data.durationMinutes)
          } catch (assignErr) {
            console.error('Failed to assign Free plan:',assignErr.message)
            setPlanDuration(5)
          }
        }else{
          console.error('Failed to fetch plan:',err.message)
          setPlanDuration(5)
        }
      }
    }
    if(currentuser?.result?._id){
      fetchPlan()
    }
  },[currentuser])



  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">
          <Gesturevideoplayer
            planDuration={planDuration}
            onNextVideo={handleNextVideo}
            onClose={handleClose}
            onShowComments={handleShowComments}
            src={`http://localhost:5000/${vv?.filepath}`}
            className="video_ShowVideo_videoPage"
          />
          <div className="video_details_videoPage">
            <div className="video_btns_title_VideoPage_cont">
              <p className="video_title_VideoPage">{vv?.title}</p>
              <div className="views_date_btns_VideoPage">
                <div className="views_videoPage">
                  {vv?.views} views <div className="dot"></div>{" "}
                  {moment(vv?.createdat).fromNow()}
                </div>
                <Likewatchlatersavebtns vv={vv} vid={vid} />
              </div>
            </div>
            <Link to={"/"} className="chanel_details_videoPage">
              <b className="chanel_logo_videoPage">
                <p>{vv?.uploader.charAt(0).toUpperCase()}</p>
              </b>
              <p className="chanel_name_videoPage">{vv?.uploader}</p>
            </Link>
            <div className="comments_VideoPage" id="comment-section">
              <h2>
                <u>Comments</u>
              </h2>
              <Comment videoid={vv?._id} />
            </div>
          </div>
        </div>
        <div className="moreVideoBar">More videos</div>
      </div>
    </div>
  );
};

export default Videopage;
