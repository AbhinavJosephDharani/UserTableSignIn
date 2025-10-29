import React, { useState } from "react";
import axios from "axios";
export default function ByUsername() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const handleSearch = async () => {
    setMsg("");
    try {
      const res = await axios.get(`http://localhost:5000/users/by-username/${username}`);
      setUser(res.data);
    } catch (err) {
      setMsg("User not found");
      setUser(null);
    }
  };
  return (
    <div>
      <h2>Search by Username</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <div>{msg}</div>
      {user && (
        <div>
          <div>Username: {user.username}</div>
          <div>First Name: {user.firstname}</div>
          <div>Last Name: {user.lastname}</div>
          <div>Salary: {user.salary}</div>
          <div>Age: {user.age}</div>
          <div>Registered: {new Date(user.registerday).toLocaleString()}</div>
          <div>Last Sign-in: {user.signintime ? new Date(user.signintime).toLocaleString() : "Never"}</div>
        </div>
      )}
    </div>
  );
}