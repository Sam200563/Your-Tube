import {combineReducers} from "redux";
import authreducer from "./auth";
import currentuserreducer from "./currentuser";
import userPoints from "./userPoints";
import videoreducer from "./video";
import historyreducer from "./history";
import likedvideoreducer from "./likedvideo";
import commentreducer from "./comment";
import chanelreducer from "./channel";
import watchlaterreducer from "./watchlater";
import downloadreducer from './downloadreducer'
export default combineReducers({
    authreducer,
    currentuserreducer,
    videoreducer,
    chanelreducer,
    historyreducer,
    likedvideoreducer,
    commentreducer,
    userPoints,
    watchlaterreducer,
    downloadreducer,
})