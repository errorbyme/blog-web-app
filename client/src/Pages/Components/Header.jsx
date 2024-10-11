import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMyContext } from "../ContextAPI/ContextApi.jsx";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { IconButton, Tooltip } from "@mui/material";

const Header = () => {
  const {
    user,
    Setuser,
    API,
    Setuserinfo,
    Setmsg,
    userinfo,
    msg,
    show,
    Setshow,
    isSearchBox,
    handleOpen,
  } = useMyContext();
  const redirect = useNavigate();

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "/") {
        handleOpen(); // Call your function when "/" is pressed
      }
    };

    // Attach the keyup event listener
    window.addEventListener("keyup", handleKeyUp);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (isSearchBox) redirect("/");
  }, [isSearchBox]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(API + "auth", { withCredentials: true });
        Setuser(res?.data.username);
        Setuserinfo(res?.data);
      } catch (e) {
        Setmsg(e?.response.data);
      }
    };
    checkAuth();
  }, [user]);

  const logout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        API + "logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (res.status == 201) {
        Setuser(null);
        Setuserinfo(null);
        console.log("Logged out successfully");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <header>
        <NavLink href="/" className="logo">
          BlogifY
        </NavLink>
        <nav>
          <div className="search-box" onClick={handleOpen}>
            <input type="text" id="search" disabled />
            <label htmlFor="search">
              Type <span>/</span> to search
            </label>
            <FaSearch className="search-icon" />
          </div>
          {user ? (
            <>
              <NavLink className="add-btn" to="/create-blog">
                <Tooltip title="New Blog">
                  <IconButton>
                    <IoIosAdd />
                  </IconButton>
                </Tooltip>
              </NavLink>
              <IconButton onClick={() => Setshow(!show)}>
                <img src={`${API}${userinfo.pfp}`} alt="profile" />
              </IconButton>
              <div className={`dropdownbox ${show && "d-show"}`}>
                <button onClick={() => redirect("profile")}>Profile</button>
                <hr />
                <button onClick={() => redirect("myblogs")}>My Blogs</button>
                <hr />
                <button onClick={logout}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/signin">Login</NavLink>
              <NavLink to="/signup">Register</NavLink>
            </>
          )}
        </nav>
      </header>
      <div className="msg-container">
        {msg && (
          <div className="msg">
            <span>Error !!</span> {msg}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
