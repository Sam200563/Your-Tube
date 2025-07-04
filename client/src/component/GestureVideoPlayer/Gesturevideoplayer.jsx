import React ,{useState,useRef,useEffect}from 'react'
import './Gesturevideoplayer.css'
import { useNavigate } from 'react-router-dom'

const Gesturevideoplayer = ({src,onNextVideo,onShowComments,onClose,planDuration}) => {
  const videoRef=useRef(null)
  const navigate=useNavigate()
  const [tapTimes,setTaptimes]=useState({left:[],center:[],right:[]})
  useEffect(()=>{
    const video=videoRef.current
    if(!video || !planDuration || Number(planDuration) === 9999){
      return;
    }
    const maxSeconds=Number(planDuration) * 60;
    const interval = setInterval(()=>{
      if(video){
        const currentVideoTime = video.currentTime
        if(currentVideoTime >= maxSeconds){
          video.pause()
          video.controls=false
          alert(`You've reached your ${planDuration}-minutes limit`)
          clearInterval(interval)
          navigate('/Upgradeplan')
        }
      }
    },1000)

    return ()=>clearInterval(interval)
  },[planDuration,navigate])

  const handleTap=(area)=>{
    const now= Date.now()
    const updated={
      ...tapTimes,
      [area]:[...tapTimes[area],now].filter((t)=>now - t < 1200)
    }
    setTaptimes(updated)
    const count = updated[area].length
    const video = videoRef.current

    if(count === 1 && area === 'center'){
      if(video.paused){
        video.play()
      }else{
        video.pause()
      }
    }

    if(count === 2){
      if(area === 'left'){
        video.currentTime= Math.max(0, video.currentTime-10)
      }else if(area === 'right'){
        video.currentTime= Math.min(video.duration, video.currentTime+10)
      }
      setTimeout(()=>{
        const cleared = {...tapTimes}
        cleared[area]=[]
        setTaptimes(cleared)
      },500)
    }

    if(count === 3){
      if(area === 'center'){
        onNextVideo && onNextVideo()
      }else if(area === 'left'){
        onShowComments && onShowComments()
      }else if(area === 'right'){
        onClose && onClose()
      }
      const cleared ={...tapTimes}
      cleared[area]=[]
      setTaptimes(cleared)
    }
  }
  return (
    <div className='video-container'>
      <video src={src} ref={videoRef} controls className='video-player' autoPlay/>
      <div className="tap-area left" onClick={()=>handleTap('left')}></div>
      <div className="tap-area center" onClick={()=>handleTap('center')}></div>
      <div className="tap-area right" onClick={()=>handleTap('right')}></div>
    </div>
  )
}

export default Gesturevideoplayer
