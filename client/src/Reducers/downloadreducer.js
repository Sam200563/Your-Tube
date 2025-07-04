
const downloadreducer=(state={data:null},action)=>{
    switch (action.type) {
        case "POST_DOWNLOAD":
            return{...state,data:action?.data}
        case "FETCH_ALL_DOWNLOAD":
            return{...state,data:action.payload}
        default:
            return state;
    }
}

export default downloadreducer