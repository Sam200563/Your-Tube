import React from 'react'
import Leftsidebar from '../../component/Leftsidebar/Leftsidebar'
import Showvideogrid from '../../component/Showvideogrid/Showvideogrid'
import vid from '../../component/Video/vid.mp4'
import { useParams } from 'react-router-dom'
import {useSelector} from "react-redux"
const Search = () => {
    const {searchquery}=useParams();
    const vids=useSelector(s=>s?.videoreducer)?.data?.filter(q=>q?.videotitle.toUpperCase().includes(searchquery?.toUpperCase()))
    // const vids=[
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
      
  return (
    <div className='container_Pages_App'>
      <Leftsidebar/>
      <div className="container2_Pages_App">
        <Showvideogrid vid={vids}/>
      </div>
    </div>
  )
}

export default Search
