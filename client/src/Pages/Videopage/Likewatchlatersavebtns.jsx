import React, { useEffect, useState } from 'react'
import {BsThreeDots} from 'react-icons/bs'
import {AiFillDislike,AiFillLike,AiOutlineLike,AiOutlineDislike}from 'react-icons/ai'
import {MdPlaylistAddCheck,MdDownload,MdDownloadDone} from 'react-icons/md'
import {RiHeartAddFill,RiPlayListAddFill,RiShareForwardLine} from 'react-icons/ri'
import "./Likewatchlatersavebtn.css"
import { useDispatch, useSelector } from 'react-redux'
import {likevideo} from '../../Action/video'
import { addtolikedvideo,deletelikedvideo } from '../../Action/likedvideo'
import { addtowatchlater,deletewatchlater } from '../../Action/watchlater'
import { addtodownload,deletedownload } from '../../Action/download'

const Likewatchlatersavebtns = ({vv,vid}) => {
  const dispatch=useDispatch()
  const [savevideo,setsavevideo]=useState(false)
  const [dislikebtn,setdislikebtn]=useState(false)
  const [likebtn,setlikebtn]=useState(false)
  const [downloadbtn,setdownloadbtn]=useState(false)
  const currentuser=useSelector(state => state.currentuserreducer);
  const likedvideolist=useSelector((state)=>state.likedvideoreducer)
  const watchlaterlist=useSelector((s)=>s.watchlaterreducer)
  const downloadlist=useSelector((s)=>s.downloadreducer)
  useEffect(()=>{
    likedvideolist?.data?.filter(
      (q)=>q.videoid===vid && q.viewer===currentuser?.result?._id
    ).map((m)=>setlikebtn(true));

    watchlaterlist?.data?.filter(
      (q)=>q.videoid===vid && q.viewer===currentuser?.result?._id
    ).map((m)=>setsavevideo(true));
    
    downloadlist?.data?.filter(
      (q)=>q.videoid===vid && q.viewer===currentuser?.result?._id
    ).map((m)=>setdownloadbtn(true))
  },[]);
  const toggledownloadvideo=()=>{
    if(currentuser){
      if(downloadbtn){
        setdownloadbtn(false)
        dispatch(deletedownload({videoid:vid,viewer:currentuser?.result?._id}))
      }else{
        setdownloadbtn(true)
        dispatch(addtodownload({videoid:vid,viewer:currentuser?.result?._id}))
      }
    }else{
      alert("Please login to download video")
    }
  }
  const togglesavedvideo=()=>{
    if(currentuser){
      if(savevideo){
        setsavevideo(false);
        dispatch(deletewatchlater({videoid:vid,viewer:currentuser?.result?._id}))
      }
      else{
        setsavevideo(true);
        dispatch(addtowatchlater({videoid:vid,viewer:currentuser?.result?._id}))
      }
    }else{
      alert("Please login to save video")
    }
  }
  const togglelikebtn=(e,lk)=>{
    if(currentuser){
      if(likebtn){
        setlikebtn(false);

        dispatch(likevideo({id:vid,Like:lk-1}))
        dispatch(deletelikedvideo({videoid:vid,viewer:currentuser?.result?._id}))
      }
      else{
        setlikebtn(true);
        dispatch(likevideo({id:vid,Like:lk+1}))
        dispatch(addtolikedvideo({videoid:vid,viewer:currentuser?.result?._id}))
        setdislikebtn(false)
      }
    }else{
      alert("Please login to save video")
    }
  }
  const toggledislikebtn=(e,lk)=>{
    if(currentuser){
      if(dislikebtn){
        setdislikebtn(false);
      }
      else{
        setdislikebtn(true);
        if(likebtn){
        dispatch(likevideo({id:vid,Like:lk-1}))
        dispatch(deletelikedvideo({videoid:vid,viewer:currentuser?.result?._id}))
      }
      setlikebtn(false)
      }
    }else{
      alert("Please login to save video")
    }
  }
  return (
    <div className='btns_cont_videoPage'>
      <div className="btn_VideoPage">
        <BsThreeDots/>
      </div>
      <div className="btn_VideoPage">
        <div className="like_videoPage" onClick={(e)=>togglelikebtn(e,vv.Like)}>
          {likebtn? (
            <>
            <AiFillLike size={22} className='btns_videoPage'/>
            </>
          ):(
            <>
            <AiOutlineLike size={22} className='btns_videoPage'/>
            </>
          )}
          <b>{vv?.like}</b>
        </div>
        <div className="like_videoPage" onClick={(e)=>toggledislikebtn(e,vv.Like)}>
          {dislikebtn? (
            <>
            <AiFillDislike size={22} className='btns_videoPage'/>
            </>
          ):(
            <>
            <AiOutlineDislike size={22} className='btns_videoPage'/>
            </>
          )}
          <b>Dislike</b>
        </div>
        <div className="like_videoPage" onClick={(e)=>togglesavedvideo(e)}>
          {savevideo? (
            <>
            <MdPlaylistAddCheck size={22} className='btns_videoPage'/>
            <b>Saved</b>
            </>
          ):(
            <>
            <RiPlayListAddFill size={22} className='btns_videoPage'/>
            <b>Save</b>
            </>
          )}
        </div>
        <div className="like_videoPage" onClick={(e)=>toggledownloadvideo(e)}>
          {downloadbtn? (
            <>
            <MdDownloadDone size={22} className='btns_videoPage'/>
            <b>Downloaded</b>
          </>
          ):(
            <>
            <MdDownload size={22} className='btns_videoPage'/>
            <b>Download</b>
          </>
          )}
        </div>
        <div className="like_videoPage">
          <>
            <RiHeartAddFill size={22} className="btns_videoPage" />
            <b>Thanks</b>
          </>
        </div>
        <div className="like_videoPage">
          <>
          <RiShareForwardLine size={22} className='btns_videoPage'/>
          <b>Share</b>
          </>
        </div>
      </div>
    </div>
  )
}

export default Likewatchlatersavebtns
