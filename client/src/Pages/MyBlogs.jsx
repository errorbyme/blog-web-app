import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMyContext } from "./ContextAPI/ContextApi";
import MyBlogsCard from "./Components/MyBlogsCard";

const MyBlogs = () => {
  const [blogs, Setblogs] = useState([]);
  const { API } = useMyContext();

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const allBlogs = await axios.get(API + "myblogs", {
          withCredentials: true,
        });
        Setblogs(allBlogs.data);
      } catch (e) {
        console.log(e);
      }
    };
    getAllBlogs();
  }, []);

  return (
    <div className="myblogs-page container">
      <h2>My Blogs</h2>
      <br />
      {blogs.length == 0 ? (
        <p>No Blogs</p>
      ) : (
        blogs.map((b, i) => <MyBlogsCard b={b} key={i} />)
      )}
    </div>
  );
};

export default MyBlogs;
