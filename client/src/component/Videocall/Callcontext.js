import React,{createContext,useRef} from "react";

export const Callcontext = createContext()

export const Callprovider=({children})=>{
    const socketRef =useRef(null)
    const peerRef=useRef(null)
    const mediaStreamRef=useRef(null)
    const screenStreamRef=useRef(null)
    const recorderRef=useRef(null)
    const recordedChunksref=useRef([])
    const targetSocketIdRef=useRef(null)

    return(
        <Callcontext.Provider
        value={{
            socketRef,
            peerRef,
            mediaStreamRef,
            screenStreamRef,
            recorderRef,
            recordedChunksref,
            targetSocketIdRef,
        }}>
            {children}
        </Callcontext.Provider>
    )
}