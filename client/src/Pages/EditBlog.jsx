import React, { useEffect, useState } from "react";
import { useMyContext } from "./ContextAPI/ContextApi";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "./Components/TextEditor";
import TagsInput from "./Components/TagsInput";
import { toast } from "react-toastify";
import Loading from "./Components/Loading";

const EditBlog = () => {
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [file, setFile] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [tags, Settags] = useState([]);
  const [isloader, Setisloader] = useState(true);

  const params = useParams();

  const { userinfo, API, Setmsg, user } = useMyContext();
  const redirect = useNavigate();
  const id = params.id;

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  useEffect(() => {
    const Blog = async () => {
      try {
        const singleBlog = await axios.post(API + "blog", { id });

        if (singleBlog.status === 201) {
          settitle(singleBlog.data.title);
          setsummary(singleBlog.data.summary);
          setEditorContent(singleBlog.data.content);
          Settags(singleBlog.data.categories);
        }
      } catch (e) {
        if (e?.response) console.log(e.response.data.message);
        console.log(e);
      } finally {
        Setisloader(false);
      }
    };
    Blog();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("summary", summary);
    formdata.append("content", editorContent);

    tags.forEach((tag) => {
      formdata.append("categories", tag); // Use the same key for each item
    });

    formdata.append("id", id);
    if (file) formdata.append("coverImageURL", file);
    try {
      const resp = await toast.promise(
        axios.put(API + "blog", formdata, {
          withCredentials: true,
        }),
        {
          pending: "updating the blog../",
          success: "👌",
        }
      );
      if (resp.status === 201) return redirect(`/blog/${id}`);
    } catch (e) {
      Setmsg(e?.response?.data.message);
    }
  };
  if (isloader) return <Loading />;
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
        placeholder="Summary..."
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
        Update the blog{" _ >"}
      </button>
    </div>
  );
};

export default EditBlog;
