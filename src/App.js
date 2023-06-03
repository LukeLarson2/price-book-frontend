import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import Home from "./containers/Home";
import LoginForm from "./containers/LoginForm";
import RegisterUser from "./containers/RegisterUser";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const User =
      localStorage.getItem("userData") !== "undefined"
        ? JSON.parse(localStorage.getItem("userData"))
        : localStorage.clear();
    if (!User && window.location.pathname !== "/user-registration") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/*" element={<LoginForm />} />
        <Route path="/user-registration" element={<RegisterUser />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
