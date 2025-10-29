import React, { useState } from "react";
import axios from "axios";
export default function RegisteredToday() {
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");
  const handleFetch = async () => {
    setMsg("");
    try {
      const res = await axios.get("http://localhost:5000/users/registered-today");
      setResults(res.data);
    } catch (err) {
      setMsg("Error fetching users");
    }
  };
  return (
    <div>
      <h2>Users Registered Today</h2>
      <button onClick={handleFetch}>Fetch</button>
      <div>{msg}</div>
      <ul>
        {results.map(u => (
          <li key={u._id}>{u.username} - Registered: {new Date(u.registerday).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}