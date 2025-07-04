import * as api from "../API";

export const addtodownload = (downloadvideo) => async (dispatch) => {
  try {
    //console.log(downloadvideo)
    const { data } = await api.addtodownload(downloadvideo);
    dispatch({ type: "POST_DOWNLOAD", data });
    dispatch(getalldownload());
  } catch (error) {
    console.log(error);
    const status= error.response?.status
    const message=error.response?.data?.message

    if (status===403 && message.includes("Daily download limit")) {
      alert("You've reached your daily free download limit")
      window.location.replace('/Upgradeplan?reason=download')
    } else {
      console.error("Download error:",error.message)
    }
  }
};

export const getalldownload = () => async (dispatch) => {
  try {
    const { data } = await api.getalldownload();
    dispatch({ type: "FETCH_ALL_DOWNLOAD", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deletedownload = (downloadvideo) => async (dispatch) => {
  try {
    const { videoid, viewer } = downloadvideo;
    await api.deletedownload(videoid, viewer);
    dispatch(getalldownload());
  } catch (error) {
    console.log(error);
  }
};
