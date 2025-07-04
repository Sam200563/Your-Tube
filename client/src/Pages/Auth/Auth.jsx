import React from "react";
import { BiLogOut } from "react-icons/bi";
import { Link ,NavLink} from "react-router-dom";
import "./Auth.css";
import { googleLogout } from "@react-oauth/google";
import { useDispatch,useSelector } from "react-redux";
import { setcurrentuser } from "../../Action/currentuser";

const Auth = ({ user, setauthbtn, seteditcreatechanelbtn }) => {
  const dispatch = useDispatch()
  const points=useSelector((state)=>state.userPoints);
  //console.log("currentpoints",points)
  const logout=()=>{
        dispatch(setcurrentuser(null))
        googleLogout()
        localStorage.clear()
  }
  return (
    <div className="Auth_container" onClick={() => setauthbtn(false)}>
      <div className="Auth_container2">
        <p className="User_Details">
            <div className="Chanel_logo_App">
            <p className="fstChar_logo_App">
              {user?.result.name ? (
                <>{user?.result?.name?.charAt(0).toUpperCase()}</>
              ) : (
                <>{user?.result?.email?.charAt(0).toUpperCase()}</>
              )}
            </p>
          </div>
          <div className="email_auth">{user?.result?.email}</div>
          
        </p>
        <div className="btns_AUTH">
          {user?.result.name ? (
            <>
              {
                <Link to={`/channel/${user?.result?._id}`} className="btn_Auth">
                  Your Channel
                </Link>
              }
            </>
          ) : (
            <>
              {
                <input
                  type="submit"
                  className="btn_Auth"
                  value="Create Your Own Channel"
                  onClick={() => seteditcreatechanelbtn(true)}
                />
              }
            </>
          )}
          <div>
            <div className="btn_auth">
              <p>Points :{points}</p>
            </div>
            <NavLink className="btn_auth" to={'/Videocall'} style={{textDecoration:'none'}}>
            <p className="live_btn">
              Go live with your friends
            </p>
          </NavLink>
            <hr />
            <div className="btn_Auth" onClick={()=>logout()}>
              <BiLogOut />
              Log Out
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
