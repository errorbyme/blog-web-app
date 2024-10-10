import { createContext, useContext, useState } from "react";
import { format } from "date-fns";

const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [user, Setuser] = useState(null);
  const [msg, Setmsg] = useState(null);
  const [userinfo, Setuserinfo] = useState();
  const [show, Setshow] = useState(false);

  const [isSearchBox, SetisSearchBox] = useState(false);
  const handleOpen = () => SetisSearchBox(true);
  const handleClose = () => SetisSearchBox(false);
  const [searchValue, SetsearchValue] = useState("");

  const formattedDate = (createdAt) => {
    const month = format(createdAt, "MMMM").substring(0, 3);
    const day = format(createdAt, "d");
    const year = format(createdAt, "y");
    return String(day + " " + month + ", " + year);
  };

  const API = "https://blog-backend-9nid.onrender.com/";
  // const API = "http://localhost:9999/";

  return (
    <MyContext.Provider
      value={{
        user,
        Setuser,
        API,
        Setuserinfo,
        userinfo,
        msg,
        Setmsg,
        formattedDate,
        show,
        Setshow,
        isSearchBox,
        SetisSearchBox,
        handleOpen,
        handleClose,
        searchValue,
        SetsearchValue,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
