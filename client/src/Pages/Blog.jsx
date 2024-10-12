import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "./ContextAPI/ContextApi";
import { Link } from "react-router-dom";
import Comments from "./Components/Comments";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { IconButton, Tooltip } from "@mui/material";
import Loading from "./Components/Loading";

const Blog = () => {
  const params = useParams();
  const [isLiked, SetisLiked] = useState(false);
  const { API, userinfo, Setmsg, user } = useMyContext();
  const redirect = useNavigate();
  const [isloader, Setisloader] = useState(true);

  const [blog, Setblog] = useState({});
  const id = params.id;

  useEffect(() => {
    window.scrollTo(0, 0);
    const Blog = async () => {
      try {
        const singleBlog = await axios.post(API + "blog", { id });
        if (singleBlog.status === 201) Setblog(singleBlog.data);
      } catch (e) {
        if (e?.response) Setmsg(e.response.data.message);
      } finally {
        Setisloader(false);
      }
    };
    Blog();
  }, []);

  useEffect(() => {
    if (blog.likes && userinfo?._id) {
      const isTrue = blog.likes.includes(JSON.stringify(userinfo._id));
      SetisLiked(isTrue);
    }
  }, [blog]);

  const deleteblog = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog post?"
    );
    if (!confirmDelete) return;
    try {
      const res = await axios.delete(API + "blog", {
        data: { id },
        withCredentials: true,
      });
      if (res.status == 201) redirect("/");
    } catch (e) {
      if (e?.response) Setmsg(e.response.data.message);
    }
  };

  const handleLike = async () => {
    try {
      await axios.put(`${API}likeBlog/${id}`, {}, { withCredentials: true });
      SetisLiked(!isLiked);
    } catch (e) {
      if (e?.response) Setmsg(e.response.data.message);
    }
  };

  if (isloader) return <Loading />;

  return (
    <div className="blog-page container">
      <div className="blog-header">
        <img src={`${API}${blog.createdBy?.pfp}`} alt="pfp" className="pfp" />
        {userinfo?._id === blog?.createdBy?._id ? (
          <>
            <strong>MyBlog /</strong>
            <div className="btns">
              <Link className="btn" to={`/edit-blog/${params.id}`}>
                <FaEdit />
              </Link>
              <Link className="btn" onClick={deleteblog}>
                <FaTrash />
              </Link>
              <a className="btn" href="#comments">
                <FaComments />
              </a>
            </div>
          </>
        ) : (
          <>
            <div>
              <h5>{blog.createdBy?.fullname}</h5>
              <h6>@{blog.createdBy?.username}</h6>
            </div>
            <div className="btns">
              {user && (
                <Tooltip title={`${isLiked ? "Unlike it" : "Like it"}`}>
                  <IconButton onClick={handleLike}>
                    {isLiked ? <BiSolidLike /> : <BiLike />}
                  </IconButton>
                </Tooltip>
              )}
              <a className="btn" href="#comments">
                <FaComments />
              </a>
            </div>
          </>
        )}
      </div>
      <h4>{blog.title}</h4>
      <div className="img">
        <img src={`${API}${blog.coverImageURL}`} alt="" />
      </div>
      <div className="blog-content">
        <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </div>
      <br />
      <br />
      <Comments blogId={id} />
      <br />
      <br />
    </div>
  );
};

export default Blog;
