import React, { useEffect, useState, useCallback } from "react";
import { useMyContext } from "../ContextAPI/ContextApi";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import Comment from "./Comment.jsx";

const Comments = ({ blogId }) => {
  const { user, API, Setmsg, msg } = useMyContext();
  const [comment, Setcomment] = useState("");
  const [comments, Setcomments] = useState([]);

  const postComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        API + "comment",
        { blogId, comment },
        { withCredentials: true }
      );
      if (res.status === 201) {
        Setcomment(""); // Clear the comment input
        getAllComments(); // Refresh comments after posting
      }
      Setmsg("");
    } catch (e) {
      if (e?.response) Setmsg(e.response.data.message);
      else Setmsg("Unexpected Error");
    }
  };

  const getAllComments = useCallback(async () => {
    try {
      const res = await axios.post(API + "comments", { blogId });
      if (res.status === 201) {
        Setcomments(res.data);
      }
    } catch (e) {
      if (e?.response) Setmsg(e.response.data.message);
      else Setmsg("Unexpected Error");
    }
  }, [API, blogId]);

  useEffect(() => {
    getAllComments(); // Load comments when the component mounts
  }, []);

  return (
    <div className="comments" id="comments">
      <div className="comments-header" style={{ top: `${msg && "115px"}` }}>
        <h3>Comments </h3>
        <form onSubmit={postComment}>
          <div className="input-group">
            <textarea
              rows={3}
              placeholder={
                user ? "Type your Comment..." : "Login To Post a comment"
              }
              disabled={!user}
              value={comment}
              onChange={(e) => Setcomment(e.target.value)}
            />
            {user && (
              <button
                type="submit"
                className="btn comment-btn"
                disabled={!user}
              >
                <IoMdSend />
              </button>
            )}
          </div>
        </form>
      </div>
      <br />
      <div className="all-comments">
        {comments.length === 0 && (
          <p>
            <em>Be the first one to comment</em>
          </p>
        )}
        {comments.map((c) => (
          <Comment
            c={c}
            key={c._id}
            Setcomments={Setcomments}
            getAllComments={getAllComments}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
