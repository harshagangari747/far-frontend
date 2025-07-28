// src/context/UserContext.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./userContextObject";
import { apiUrl } from "../api/apiurl";

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("userInfo");
    const fetchUser = async () => {
      const email = localStorage.getItem("emailId");
      const token = setTimeout(localStorage.getItem("access_token"), 500);
      const localstorageToken = localStorage.getItem("access_token");
      console.log("toekn", token);
      console.log("l token", localstorageToken);

      if (!email) {
        setIsLoadingUser(false);
        return;
      } else {
        if (userInfoFromStorage) {
          setUserInfo(JSON.parse(userInfoFromStorage));
          setIsLoadingUser(false);
          return;
        }
        try {
          const res = await axios.get(`${apiUrl}/profile?emailId=${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const user = res.data?.data?.[0];
          if (user) {
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
