import React from 'react'
import vid from "../../component/Video/vid.mp4"
import WHL from '../../component/WHL/WHL'
import { useSelector } from 'react-redux'
const Watchhistory = () => {
  const watchhistoryvideolist=useSelector(s=>s.historyreducer)
  return (
    <WHL page={"History"} videolist={watchhistoryvideolist}/>
  )
}

export default Watchhistory
