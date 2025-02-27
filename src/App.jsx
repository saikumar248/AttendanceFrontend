import React from "react";
import Admin from "./pages/Admin/Admin";
import SignIn from "./pages/SignIn/SignIn";
import { Routes, Route } from "react-router-dom";
import SuperAdmin from "./pages/SuperAdmin/SuperAdmin";
import Intern from "./pages/Intern/Intern";
import { UserProvider } from "./components/context/UserContext";
import SignUp from "./pages/SignUp/SignUp";

function App() {
  return (
    <>
      <UserProvider>
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
