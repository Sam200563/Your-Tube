import React from 'react'
import Leftsidebar from '../../component/Leftsidebar/Leftsidebar'
import "./Home.css"
import Showvideogrid from '../../component/Showvideogrid/Showvideogrid'
import vid from "../../component/Video/vid.mp4"
import {useSelector} from "react-redux"
const Home = () => {
  const vids=useSelector(state=>state.videoreducer)?.data?.filter(q=>q).reverse()
  // const vids=[
  //   {
  //     _id:1,
  //     video_src:vid,
  //     chanel:"wrdjirmjogturndidbjj",
  //     title:"video1",
  //     uploader:"abc",
  //     description:"description of video 1"
  //   },
  //   {
  //     _id:2,
  //     video_src:vid,
  //     chanel:"wrdjirmjogturndidbjj",
  //     title:"video2",
  //     uploader:"abc",
  //     description:"description of video 2"
  //   },
  //   {
  //     _id:3,
  //     video_src:vid,
  //     chanel:"wrdjirmjogturndidbjj",
  //     title:"video3",
  //     uploader:"abc",
  //     description:"description of video 3"
  //   },
  //   {
  //     _id:4,
  //     video_src:vid,
  //     chanel:"wrdjirmjogturndidbjj",
  //     title:"video4",
  //     uploader:"abc",
  //     description:"description of video 4"
  //   },
  // ]
    const navlist=[
        "All",
        "Python",
        "Java",
        "C++",
        "Movies",
        "Science",
        "Animation",
        "Gaming",
        "Comedy"
    ];
  return (
    <div className='container_Pages_App'>
      <Leftsidebar/>
      <div className="container2_Pages_App">
        <div className="navigation_Home">
            {navlist.map((m)=>{
                return(
                    <p key={m} className='btn_nav_home'>{m}</p>
                );
            })}
        </div>
        <Showvideogrid vid={vids}/>
      </div>
    </div>
  )
}

export default Home
