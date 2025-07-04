export const addPoints = (points)=>{
    return{
        type:'ADD_POINTS',
        payload:points,
    }
}

export const resetPoints=()=>{
    return{
        type:'RESET_POINTS',
    }
}