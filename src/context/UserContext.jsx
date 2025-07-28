// src/context/UserContext.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./userContextObject";
import { apiUrl } from "../api/apiurl";

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    console.log("Triggering api for user info...");
    const userInfoFromStorage = localStorage.getItem("userInfo");
    const fetchUser = async () => {
      console.log("api triggered");
      const email = localStorage.getItem("emailId");
      console.log("emailid", email);
      if (!email) {
        setIsLoadingUser(false);
        console.warn("No emailId found in localStorage");
        return;
      } else {
        if (userInfoFromStorage) {
          console.log("Using cached user info");
          setUserInfo(JSON.parse(userInfoFromStorage));
          setIsLoadingUser(false);
          return;
        }
        try {
          const res = await axios.get(`${apiUrl}/profile?emailId=${email}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            },
          });
          const user = res.data?.data?.[0];
          if (user) {
            console.log("setting user");
            setUserInfo(user);
            localStorage.setItem("userInfo", JSON.stringify(user));
          }
        } catch (err) {
          console.error("Failed to fetch user info", err);
        } finally {
          setIsLoadingUser(false);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, isLoadingUser }}>
      {children}
    </UserContext.Provider>
  );
};
