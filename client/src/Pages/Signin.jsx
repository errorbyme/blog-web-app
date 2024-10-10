import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMyContext } from "./ContextAPI/ContextApi.jsx";
import { toast } from "react-toastify";

const Signin = () => {
  const [username, Setusername] = useState("");
  const [password, Setpassword] = useState("");
  const { user, Setuser, API, Setmsg } = useMyContext();
  const redirect = useNavigate();

  useEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);

  const submitHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await toast.promise(
        axios.post(
          API + "login",
          {
            username,
            password,
          },
          { withCredentials: true }
        ),
        {
          pending: "Please wait../",
          success: "👌",
        }
      );
      if (response.status === 200) redirect("/");
      Setuser(null);
    } catch (e) {
      if (e?.response) {
        Setmsg(e.response.data.message);
      } else {
        Setmsg("Unexpected server error");
      }
    }
  };

  return (
    <form>
      <div className="form-page container">
        <h2>Sign In</h2>
        <input
          type="email"
          onChange={(e) => Setusername(e.target.value)}
          value={username}
          name="username"
          placeholder="Username"
          autoFocus
        />
        <input
          type="password"
          onChange={(e) => Setpassword(e.target.value)}
          value={password}
          name="password"
          placeholder="Password"
        />
        <button onClick={submitHandle}>Sign In</button>
      </div>
    </form>
  );
};

export default Signin;
