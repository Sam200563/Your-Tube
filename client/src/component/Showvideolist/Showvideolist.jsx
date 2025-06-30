import React from 'react'
import Showvideo from '../Showvideo/Showvideo'
import vid from "../../component/Video/vid.mp4"
import { useSelector } from 'react-redux'
const Showvideolist = ({videoid}) => {
  const vids=useSelector(state=>state.videoreducer)
    // const vids = [
    //       {
    //         _id: 1,
    //         video_src: vid,
    //         chanel: "wrdjirmjogturndidbjj",
    //         title: "video1",
    //         uploader: "abc",
    //         description: "description of video 1",
    //       },
    //       {
    //         _id: 2,
    //         video_src: vid,
    //         chanel: "wrdjirmjogturndidbjj",
    //         title: "video2",
    //         uploader: "abc",
    //         description: "description of video 2",
    //       },
    //       {
    //         _id: 3,
    //         video_src: vid,
    //         chanel: "wrdjirmjogturndidbjj",
    //         title: "video3",
    //         uploader: "abc",
    //         description: "description of video 3",
    //       },
    //       {
    //         _id: 4,
    //         video_src: vid,
    //         chanel: "wrdjirmjogturndidbjj",
    //         title: "video4",
    //         uploader: "abc",
    //         description: "description of video 4",
    //       },
    //     ];
  return (
    <div className='Container_ShowVideoGrid'>
        {
            vids?.data?.filter(q=>q._id===videoid).map(vi=>{
                return(
                    <div className="video_box_app" key={vi._id}>
                        <Showvideo vid={vi}/>
                    </div>
                )
            })
        }
      
    </div>
  )
}

export default Showvideolist
