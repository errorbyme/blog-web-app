import React, { useEffect, useState } from "react";
import TextEditor from "./Components/TextEditor";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMyContext } from "./ContextAPI/ContextApi.jsx";
import TagsInput from "./Components/TagsInput.jsx";

const CreateBlog = () => {
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [file, setFile] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [tags, Settags] = useState([]);

  const { userinfo, API, Setmsg, user } = useMyContext();

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  const redirect = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("summary", summary);
    formdata.append("content", editorContent);
    formdata.append("userid", userinfo._id);
    tags.forEach((tag) => {
      formdata.append("categories", tag); // Use the same key for each item
    });

    formdata.append("coverImageURL", file);

    try {
      const res = await axios.post(API + "createblog", formdata);
      if (res.status === 201) {
        redirect("/");
        Settags([]);
      }
    } catch (e) {
      if (e?.response) {
        Setmsg(e.response.data.message);
      } else {
        Setmsg("Unexpected server error");
      }
    }
  };

  return (
    <div className="create-blog-page container">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => settitle(e.target.value)}
      />
      <input
        type="file"
        name="coverImageURL"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <textarea
        name=""
        id=""
        value={summary}
        onChange={(e) => setsummary(e.target.value)}
        placeholder="Summary [max 220 characters]*"
        rows={3}
        maxLength={220}
      ></textarea>
      <TagsInput tags={tags} Settags={Settags} />
      <TextEditor
        editorContent={editorContent}
        setEditorContent={setEditorContent}
      />
      <br />
      <button onClick={handleSubmit} type="submit">
        Publish This Blog{" _ >"}
      </button>
    </div>
  );
};

export default CreateBlog;
