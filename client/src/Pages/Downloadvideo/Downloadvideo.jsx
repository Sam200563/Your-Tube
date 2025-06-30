import React from 'react'
import WHL from '../../component/WHL/WHL'
import { useSelector } from 'react-redux'
const Downloadvideo = () => {
    const downloadvideolist=useSelector((state)=>state.downloadreducer)
  return (
    <WHL page={"Download"} videolist={downloadvideolist}/>
  )
}

export default Downloadvideo
