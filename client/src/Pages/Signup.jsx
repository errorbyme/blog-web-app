import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "./ContextAPI/ContextApi";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [username, Setusername] = useState("");
  const [fullname, Setfullname] = useState("");
  const [password, Setpassword] = useState("");
  const [file, Setfile] = useState(null);

  const { API, Setmsg, user } = useMyContext();

  useEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);
  const redirect = useNavigate();

  const submitHandle = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("fullname", fullname);
    if (file) formData.append("file", file);
    try {
      const response = await toast.promise(
        axios.post(API + "register", formData),
        {
          pending: "Please wait../",
          success: "👌",
        }
      );
      if (response.status === 201) redirect("/signin");
    } catch (e) {
      if (e?.response) {
        Setmsg(e.response.data.message);
      } else {
        Setmsg("unexpected server error occurred");
      }
    }
  };

  return (
    <form encType="multipart/form-data">
      <div className="form-page container">
        <h2>Sign Up</h2>
        <input
          type="text"
          onChange={(e) => Setfullname(e.target.value)}
          value={fullname}
          name="fullname"
          placeholder="Fullname"
          autoFocus
        />
        <input
          type="email"
          onChange={(e) => Setusername(e.target.value)}
          value={username}
          name="username"
          placeholder="Username"
        />
        <input
          type="password"
          onChange={(e) => Setpassword(e.target.value)}
          value={password}
          name="password"
          placeholder="Password"
        />
        <input
          type="file"
          onChange={(e) => Setfile(e.target.files[0])}
          name="file"
        />
        <button onClick={submitHandle}>Sign up</button>
      </div>
    </form>
  );
};

export default Signup;
