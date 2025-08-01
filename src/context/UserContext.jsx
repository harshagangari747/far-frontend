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
      setTimeout(async () => {
        const email = localStorage.getItem("emailId");
        const localstorageToken = localStorage.getItem("access_token");
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
                Authorization: `Bearer ${localstorageToken}`,
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
      }, 700);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, isLoadingUser }}>
      {children}
    </UserContext.Provider>
  );
};
