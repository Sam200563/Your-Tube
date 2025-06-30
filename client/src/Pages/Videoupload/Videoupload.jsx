import React, { useState } from 'react'
import './Videoupload.css'
import {buildStyles,CircularProgressbar} from "react-circular-progressbar"
import { useSelector,useDispatch } from 'react-redux'
import { uploadvideo } from '../../Action/video'
const Videoupload = ({setvideouploadpage}) => {
    const [title,settitle]=useState("")
    const [videofile,setvideofile]=useState("")
    const [progress,setprogress]=useState(0)
    const dispatch=useDispatch()
    const handlesetvideofile=(e)=>{
        setvideofile(e.target.files[0])
    }
    const currentuser=useSelector((state) => state.currentuserreducer);
    const fileoption={
        onUploadProgress:(ProgressEvent)=>{
            const {loaded,total}=ProgressEvent;
            const percentage=Math.floor(((loaded/1000)*100)/(total/1000))
            setprogress(percentage)
            if(percentage===100){
                setTimeout(function() { },3000)
                setvideouploadpage(false)
            }
        },
    }
    const uploadvideofile=()=>{
        if(!title){
            alert("Please enter a title of the video")
        }else if(!videofile){
            alert("Please attach a video file")
        }else if(videofile.size >100000000){
            alert("Please attach video file less than 100 mb")
        }else{
            const filedata=new FormData()
            filedata.append("file",videofile)
            filedata.append("title",title)
            filedata.append("chanel",currentuser?.result?._id)
            filedata.append("uploader",currentuser?.result?.name)
            console.log(videofile)
            dispatch(uploadvideo({filedata:filedata,fileoption:fileoption}))
        }
    }
  return (
    <div className='container_VidUpload'>
        <input type="submit" name="text" value={"X"} onClick={()=>setvideouploadpage(false)} className="ibtn_x" />
        <div className="container2_VidUpload">
            <div className="ibox_div_vidupload">
                <input type="text" maxLength={30} placeholder='Enter title of your video' className='ibox_vidupload' onChange={(e)=>{
                    settitle(e.target.value)
                }} />
                <label htmlFor="file" className="ibox_cidupload btn_vidUpload">
                    <input type="file" name="file" style={{fontSize:"1rem"}} onChange={(e)=>{handlesetvideofile(e)}} className='ibox_vidupload' id="file" />
                </label>
            </div>
            <div className="ibox_div_vidupload">
                <input type="submit" value={"Upload"} onClick={()=>uploadvideofile()} className='ibox_vidupload btn_vidUpload' />
                <div className="loader ibox_div_vidupload">
                            <CircularProgressbar value={progress} text={`${progress}`}
                            styles={buildStyles({
                                rotation:0.25,
                                strokeLinecap:"butt",
                                textSize:"20px",
                                pathTransitionDuration: 0.5,
                                pathColor: `rgba(255,255,255,${progress / 100})`,
                                textColor: "#f88",
                                trailColor: "#adff2f",
                                backgroundColor: "#3e98c7",
                            })}/>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default Videoupload
