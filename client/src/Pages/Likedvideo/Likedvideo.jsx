import React from 'react'
import vid from "../../component/Video/vid.mp4"
import WHL from "../../component/WHL/WHL"
import { useSelector } from 'react-redux'
const Likedvideo = () => {
    
    const likedvideos=useSelector((state)=>state.likedvideoreducer)
  return (
    <WHL page={"Liked video"} videolist={likedvideos} />
  )
}

export default Likedvideo
