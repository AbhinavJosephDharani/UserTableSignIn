
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ByName from "./pages/ByName";
import ByUsername from "./pages/ByUsername";
import BySalary from "./pages/BySalary";
import ByAge from "./pages/ByAge";
import RegisteredAfter from "./pages/RegisteredAfter";
import NeverSignedIn from "./pages/NeverSignedIn";
import SameDayAs from "./pages/SameDayAs";
import RegisteredToday from "./pages/RegisteredToday";

function App() {
  return (
    <Router>
      <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
        <Link to="/">Home</Link> | 
        <Link to="/register">Register</Link> | 
        <Link to="/login">Sign In</Link> | 
        <Link to="/by-name">Search by Name</Link> | 
        <Link to="/by-username">Search by UserID</Link> | 
        <Link to="/by-salary">Search by Salary</Link> | 
        <Link to="/by-age">Search by Age</Link> | 
        <Link to="/registered-after">Registered After</Link> | 
        <Link to="/never-signed-in">Never Signed In</Link> | 
        <Link to="/same-day-as">Same Day As</Link> | 
        <Link to="/registered-today">Registered Today</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/by-name" element={<ByName />} />
        <Route path="/by-username" element={<ByUsername />} />
        <Route path="/by-salary" element={<BySalary />} />
        <Route path="/by-age" element={<ByAge />} />
        <Route path="/registered-after" element={<RegisteredAfter />} />
        <Route path="/never-signed-in" element={<NeverSignedIn />} />
        <Route path="/same-day-as" element={<SameDayAs />} />
        <Route path="/registered-today" element={<RegisteredToday />} />
      </Routes>
    </Router>
  );
}

export default App;