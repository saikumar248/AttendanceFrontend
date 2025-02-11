import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [signedInUser, setUser] = useState({
    designation: "",
    email: "",
    fullName: "",
    id: "",
    imageName: "",
    imageType: "",
    mobile: "",
    profilePicUrl: "",
  }); 

  return (
    <UserContext.Provider value={{ signedInUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
