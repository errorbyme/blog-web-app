import React, { useCallback, useEffect, useState } from "react";
import { useMyContext } from "../ContextAPI/ContextApi";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { BiDotsVertical } from "react-icons/bi";
import { IconButton } from "@mui/material";

const Comment = ({ c, Setcomments, getAllComments }) => {
  const { user, API, Setmsg, formattedDate } = useMyContext();
  const [editbox, Seteditbox] = useState(false);
  const [comment, Setcomment] = useState(c?.comment);
  const [showbox, Setshowbox] = useState(false);

  useEffect(() => {
    Setmsg("");
    Setshowbox(false);
  }, [comment]);

  const updateComment = async () => {
    try {
      const res = await axios.put(
        API + `comment/${c._id}`,
        { updatedcomment: comment },
        {
          withCredentials: true,
        }
      );
      if (res.status == 201) {
        await getAllComments();
        Seteditbox(false);
      }
    } catch (e) {
      if (e?.response) Setmsg(e.response.data.message);
    }
  };

  const deleteComment = useCallback(async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;
    try {
      const res = await axios.delete(API + `comment/${c._id}`, {
        withCredentials: true,
      });
      if (res.status === 201) {
        Setmsg("");
        Setcomments((prevComments) =>
          prevComments.filter((comment) => comment._id !== c._id)
        );
      }
    } catch (e) {
      if (e?.response) Setmsg(e.response.data.message);
    }
  }, []);

  return (
    <div className="comment-content">
      <div className="comment-details">
        <img src={`${API}${c.commentBy?.pfp}`} className="pfp" alt="" />
        <h5>
          @{c.commentBy?.username}
          {c.commentBy?.username === user && (
            <div className={`dropdownbox ${showbox && "d-show"}`}>
              <button onClick={() => Seteditbox(!editbox)}>Edit</button>
              <button onClick={deleteComment}>Delete</button>
            </div>
          )}
        </h5>
        {c.commentBy?.username === user && (
          <IconButton onClick={() => Setshowbox(!showbox)}>
            <BiDotsVertical />
          </IconButton>
        )}
        <em className="date">{formattedDate(c.createdAt)}</em>
      </div>
      {!editbox ? (
        <p>{c.comment}</p>
      ) : (
        <div className="input-group">
          <p>
            <textarea
              disabled={!user}
              value={comment}
              onChange={(e) => Setcomment(e.target.value)}
              autoFocus
            ></textarea>
            <button
              onClick={updateComment}
              className="btn comment-btn"
              disabled={!user}
            >
              <IoMdSend />
            </button>
          </p>
        </div>
      )}
      <br />
      <hr />
      <br />
    </div>
  );
};

export default Comment;
