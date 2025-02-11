import React from "react";
import Admin from "./Admin";
import SignIn from "./SignIn";
import { Routes, Route } from "react-router-dom";
import SuperAdmin from "./SuperAdmin";
import Intern from "./Intern";
// import SignUp from "./SignUp";
import { UserProvider } from "./components/context/UserContext";
import SignUp from "./components/SignUp";
function App() {
  return (
    <>
    <UserProvider>
      {/* <Admin/> */}
      {/* <SignIn/> */}
      <div>
        <div className="App">
          <Routes>
            <Route path="/" element={<SignIn />} />

            <Route path="/admin/*" element={<Admin />} />
            <Route path="/super/*" element={<SuperAdmin />} />
            <Route path="/intern/*" element={<Intern/>} />|
            
            <Route path="/signup" element={<SignUp/>} />

          </Routes>
        </div>
      </div>
      </UserProvider>
    </>
  );
}

export default App;
