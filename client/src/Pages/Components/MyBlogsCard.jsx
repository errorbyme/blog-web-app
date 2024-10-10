import React, { useEffect, useState } from "react";
import { useMyContext } from "../ContextAPI/ContextApi";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaChevronRight, FaComment, FaEye } from "react-icons/fa";
import { BiLike, BiSolidLike } from "react-icons/bi";

const MyBlogsCard = ({ b }) => {
  const blogId = b._id;
  const { API } = useMyContext();
  const [commentsLength, SetcommentsLength] = useState(0);
  const [comments, Setcomments] = useState([]);

  useEffect(() => {
    const getAllComments = async () => {
      try {
        const res = await axios.post(API + "comments", { blogId });
        if (res.status == 201) {
          Setcomments(res.data);
        }
      } catch (e) {
        if (e?.response) Setmsg(e.response.data.message);
        else Setmsg("Unexpected Error");
      }
    };
    getAllComments();
  }, []);

  useEffect(() => {
    SetcommentsLength(comments.length);
  }, [comments]);
  return (
    <div className="myblog-card">
      <img src={`${API}${b.coverImageURL}`} className="image" alt="" />
      <Link to={`/blog/${b._id}`} className="myblog-content">
        <h5>
          {b.title}
          <span>
            <FaChevronRight />
          </span>
        </h5>
        <div className="card-footer">
          <div className="box">
            <FaEye />
            <span> {b.views} views</span>
          </div>
          <div className="box">
            <BiSolidLike />
            <span> {b.likes.length} likes</span>
          </div>
          <div className="box">
            <FaComment />
            <span> {commentsLength} comments</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MyBlogsCard;
