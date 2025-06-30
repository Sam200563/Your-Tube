import React from 'react'
import vid from "../../component/Video/vid.mp4"
import WHL from "../../component/WHL/WHL"
import { useSelector } from 'react-redux'
const Likedvideo = () => {
    // const likedvideos=[
    //     {
    //       _id:1,
    //       video_src:vid,
    //       chanel:"wrdjirmjogturndidbjj",
    //       title:"video1",
    //       uploader:"abc",
    //       description:"description of video 1"
    //     },
    //     {
    //       _id:2,
    //       video_src:vid,
    //       chanel:"wrdjirmjogturndidbjj",
    //       title:"video2",
    //       uploader:"abc",
    //       description:"description of video 2"
    //     },
    //     {
    //       _id:3,
    //       video_src:vid,
    //       chanel:"wrdjirmjogturndidbjj",
    //       title:"video3",
    //       uploader:"abc",
    //       description:"description of video 3"
    //     },
    //     {
    //       _id:4,
    //       video_src:vid,
    //       chanel:"wrdjirmjogturndidbjj",
    //       title:"video4",
    //       uploader:"abc",
    //       description:"description of video 4"
    //     },
    //   ]
    const likedvideos=useSelector((state)=>state.likedvideoreducer)
  return (
    <WHL page={"Liked video"} videolist={likedvideos} />
  )
}

export default Likedvideo
