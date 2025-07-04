import React from 'react'
import vid from "../../component/Video/vid.mp4"
import WHL from '../../component/WHL/WHL'
import { useSelector } from 'react-redux'
const Watchlater = () => {
  const watchlatervideolist=useSelector((s)=>s.watchlaterreducer)
    
  return (
    <WHL page={"Watchlater"} videolist={watchlatervideolist}/>
  )
}

export default Watchlater
