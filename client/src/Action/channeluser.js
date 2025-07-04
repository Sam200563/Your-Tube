import * as api from "../API";

export const fetchallchannel=()=>async(dispatch)=>{
    try{
        const {data}=await api.fetchallchannel();
        dispatch({type:"FETCH_CHANELS",payload:data})
    }catch(error){
        console.log(error)
    }
}

export const updatechaneldata=(id,updatedate)=>async(dispatch)=>{
    try {
        const {data}=await api.updatechaneldata(id,updatedate);
        dispatch({type:"UPDATE_DATA",payload:data})
    } catch (error) {
        console.log(error)
    }
}