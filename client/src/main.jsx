import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Blogs from "./Pages/Blogs.jsx";
import Blog from "./Pages/Blog.jsx";
import CreateBlog from "./Pages/CreateBlog.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import Signin from "./Pages/Signin.jsx";
import Signup from "./Pages/Signup.jsx";
import { ContextProvider } from "./Pages/ContextAPI/ContextApi.jsx";
import EditBlog from "./Pages/EditBlog.jsx";
import MyBlogs from "./Pages/MyBlogs.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Blogs />,
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "blog/:id",
        element: <Blog />,
      },
      {
        path: "create-blog",
        element: <CreateBlog />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "myblogs",
        element: <MyBlogs />,
      },
      {
        path: "edit-blog/:id",
        element: <EditBlog />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>
);
