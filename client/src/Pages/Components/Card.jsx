import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useMyContext } from "../ContextAPI/ContextApi";
import { BiLike } from "react-icons/bi";
import { FaComments, FaEye, FaBookReader } from "react-icons/fa";
import axios from "axios";
import { Button } from "@mui/material";

const Card = ({ b }) => {
  const blogId = b._id;
  const [commentsLength, SetcommentsLength] = useState(0);
  const [comments, Setcomments] = useState([]);
  const { Setmsg, API, formattedDate } = useMyContext();

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

  console.log(b.createdBy?.pfp);

  return (
    <div className="card">
      <div className="card-header">
        <img src={`${API}${b.createdBy?.pfp}`} className="pfp" alt="" />
        <h5>
          {b.createdBy?.fullname}
          <span className="date">{formattedDate(b.createdAt)}</span>
        </h5>
      </div>
      <div className="card-wrapper">
        <div className="img">
          <img src={`${API}${b.coverImageURL}`} alt="coverpage" />
        </div>
        <div className="card-content">
          <h4>{b.title}</h4>
          <p>{b.summary}</p>
          <Button
            className="read-btn"
            component={NavLink}
            to={`blog/${b._id}`}
            variant="outlined" // Optional: use a variant you like
            endIcon={<FaBookReader />}
          >
            Read it
          </Button>
          <div className="card-footer">
            <div className="box">
              <FaEye />
              <span> {b.views} views</span>
            </div>
            <div className="box">
              <BiLike />
              <span> {b.likes.length} likes</span>
            </div>
            <div className="box">
              <FaComments />
              <span> {commentsLength} comments</span>
            </div>
          </div>
        </div>
      </div>
      <br />
      <hr />
    </div>
  );
};

export default Card;
