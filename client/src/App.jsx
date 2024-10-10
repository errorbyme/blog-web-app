import React, { useEffect } from "react";
import "./App.css";
import Header from "./Pages/Components/Header";
import { Outlet, useLocation } from "react-router-dom";
import { useMyContext } from "./Pages/ContextAPI/ContextApi";
import GoBackButton from "./Pages/Components/GoBackButton";
import SearchPage from "./Pages/Components/SearchPage";

const App = () => {
  const location = useLocation();
  const { Setmsg, Setshow } = useMyContext();

  useEffect(() => {
    Setmsg(null);
    Setshow(false);
  }, [location]);

  return (
    <>
      <Header />
      <SearchPage />
      <div className="container-fluid">
        {!(location.pathname === "/") && <GoBackButton />}
        <Outlet />
      </div>
    </>
  );
};

export default App;
