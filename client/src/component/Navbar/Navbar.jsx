import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import logo from "./logo.ico";
import { Link } from "react-router-dom";
import { RiVideoAddLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";
import { BsMicFill } from "react-icons/bs";
import Searchbar from "./Searchbar/Searchbar";
import Auth from "../../Pages/Auth/Auth";
import axios from "axios";
import { login } from "../../Action/auth";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { setcurrentuser } from "../../Action/currentuser";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ toggledrawer, seteditcreatechanelbtn }) => {
  const [authbtn, setauthbtn] = useState(false);
  const dispatch = useDispatch();

  const currentuser = useSelector((state) => state.currentuserreducer);
  const google_login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );

        const profile = res.data;

        const userObject = {
          result: {
            name: profile.name,
            email: profile.email,
          },
          token: tokenResponse.access_token,
        };

        dispatch(setcurrentuser(userObject));
        localStorage.setItem("Profile", JSON.stringify(userObject));
        dispatch(login({ email: profile.email }));
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
  });

  const logout = () => {
    dispatch(setcurrentuser(null));
    googleLogout();
    localStorage.clear();
  };
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("Profile"))?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logout();
      } else {
        dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
      }
    }
  }, [dispatch]);

  return (
    <>
      <div className="Container_Navbar">
        <div className="Burger_Logo_Navbar">
          <div className="burger" onClick={toggledrawer}>
            <p></p>
            <p></p>
            <p></p>
          </div>
          <Link to={"/"} className="logo_div_Navbar">
            <img src={logo} alt="logo" />
            <p className="logo_title_navbar">YourTube</p>
          </Link>
        </div>

        <Searchbar className="Searchbar" />
        <BsMicFill className="Mic_SearchBar" />
        <RiVideoAddLine size={22} className="vid_bell_Navbar" />

        <div className="apps_Box">
          {[...Array(10)].map((_, i) => (
            <p key={i} className="appBox"></p>
          ))}
        </div>

        <IoMdNotificationsOutline size={22} className="vid_bell_Navbar" />

        <div className="Auth_cont_Navbar">
          {currentuser ? (
            <div className="Chanel_logo_App" onClick={() => setauthbtn(true)}>
              <p className="fstChar_logo_App">
                {currentuser?.result?.name
                  ? currentuser.result.name.charAt(0).toUpperCase()
                  : currentuser?.result?.email?.charAt(0).toUpperCase()}
              </p>
            </div>
          ) : (
            <p className="Auth_Btn" onClick={google_login}>
              <BiUserCircle size={18} />
              <b>Sign in</b>
            </p>
          )}
        </div>
      </div>

      {authbtn && (
        <Auth
          seteditcreatechanelbtn={seteditcreatechanelbtn}
          setauthbtn={setauthbtn}
          user={currentuser}
        />
      )}
    </>
  );
};

export default Navbar;
