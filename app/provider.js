"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { UserDetailContext } from "./_context/UserDetailContext";

function Provider({ children }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    if (user) {
      verifyUsers();
    }
  }, [user]);

  const verifyUsers = async () => {
    try {
      const { data } = await axios.post("/api/verify-user", {
        user: {
          fullName: user?.fullName || "Anonymous",
          primaryEmailAddress: user?.primaryEmailAddress?.emailAddress || "no-email",
          imageUrl: user?.imageUrl || null,
        },
      });
      setUserDetail(data.result);
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;
