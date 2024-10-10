import React, { useEffect, useState } from "react";
import { useMyContext } from "./ContextAPI/ContextApi.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiEditCircleFill } from "react-icons/ri";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { API, userinfo, user, Setuser, Setuserinfo, Setmsg } = useMyContext();
  const redirect = useNavigate();
  const [fullname, Setfullname] = useState(userinfo?.fullname);
  const [username, Setusername] = useState(userinfo?.username);
  const [showeditbox, Setshoweditbox] = useState(false);

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  const deleteacc = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your Account?"
    );
    if (!confirmDelete) return;
    try {
      const res = await axios.delete(API + "user", {
        withCredentials: true,
      });
      if (res.status == 201) {
        await axios.get(API + "logout", {
          withCredentials: true,
        });
        Setuser(null);
        Setuserinfo(null);
        redirect("/");
      }
    } catch (e) {
      if (e?.response) Setmsg(e.response.data.message);
    }
  };

  const handlepfp = async (e) => {
    e.preventDefault();
    const pfp = e.target.files[0];
    const formdata = new FormData();

    if (pfp) formdata.append("pfp", pfp);

    try {
      const res = await toast.promise(
        axios.put(API + "pfpupdate", formdata, {
          withCredentials: true,
        }),
        {
          pending: "Updating profile pict../",
          success: "👌",
        }
      );
      if (res.status == 201) {
        const authres = await axios.get(API + "auth", {
          withCredentials: true,
        });
        Setuser(authres.data.username);
        Setuserinfo(authres.data);
        Setmsg("");
      }
    } catch (e) {
      if (e?.response) Setmsg(e?.response.data.message);
    }
  };

  const updateProfile = async () => {
    if (userinfo?.fullname === fullname && userinfo?.username === username) {
      return handleCancel();
    }
    try {
      const res = await toast.promise(
        axios.put(
          API + "profileupdate",
          { fullname, username },
          { withCredentials: true }
        ),
        {
          pending: "Updating profile info../",
          success: "👌",
        }
      );
      if (res.status === 201) {
        const authres = await axios.get(API + "auth", {
          withCredentials: true,
        });
        Setuser((prevUser) => authres.data.username);
        Setuserinfo((prevInfo) => authres.data);
        Setshoweditbox(false);
        Setmsg("");
      }
    } catch (e) {
      if (e?.response) Setmsg(e?.response.data.message);
    }
  };
  const handleCancel = async () => {
    Setshoweditbox(false);
    Setfullname(userinfo?.fullname || "");
    Setusername(userinfo?.username || "");
  };

  return (
    <div className="profile-page container">
      <div className="img">
        <img src={`${API}${userinfo?.pfp}`} alt="Pf" />
        <label htmlFor="pfp">
          <RiEditCircleFill />
        </label>
        <input type="file" id="pfp" name="pfp" onChange={handlepfp} hidden />
      </div>
      <h3>
        {showeditbox ? (
          <input
            type="text"
            value={fullname}
            onChange={(e) => Setfullname(e.target.value)}
            autoFocus
            placeholder="Fullname"
          />
        ) : (
          userinfo?.fullname
        )}
      </h3>
      <h4>
        {showeditbox ? (
          <input
            type="text"
            value={username}
            onChange={(e) => Setusername(e.target.value)}
            placeholder="Username"
          />
        ) : (
          "@" + userinfo?.username
        )}
      </h4>
      <div className="btns">
        {!showeditbox ? (
          <>
            <button className="btn" onClick={deleteacc}>
              Delete Account
            </button>

            <button
              className="btn"
              onClick={() => Setshoweditbox(!showeditbox)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <button className="btn" onClick={handleCancel}>
              Cancel
            </button>

            <button className="btn" onClick={updateProfile}>
              Update Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
