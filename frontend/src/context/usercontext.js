import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";


const UserContext = createContext(null);


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    avatar: "",
    bio: "",
    phone: "",
    location: "",
  });
  const [token,setToken] = useState(localStorage.getItem("token"));

  useEffect( ()=>{
    if(localStorage.getItem("token")){
        axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/auth/profile`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => {
        console.log("Profile Response:", response);
        setUser((prevUser) => ({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.avatar,
          bio: response.data.bio,
          phone: response.data.phone,
          location: response.data.location,
        }));
      }).catch((error) => {
        console.error("Profile Error:", error);
      })
    }
    setToken(localStorage.getItem("token"));
  },[token])

  const updateUser = (newUserData , newToken) => {
    localStorage.setItem("token", newToken);

    setToken(newToken);

    setUser((prevUser) => ({
      id: newUserData._id ??  null,
      name: newUserData.name ??  "",
      email: newUserData.email ??  "",
      avatar: newUserData.avatar ?? "",
      bio: newUserData.bio ??  "",
      phone: newUserData.phone ??  "",
      location: newUserData.location ??  "",
    }));
  };

  return (
    <UserContext.Provider value={{ user,token, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
