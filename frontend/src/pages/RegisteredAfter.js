import React, { useState } from "react";
import axios from "axios";
export default function RegisteredAfter() {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");
  const handleSearch = async () => {
    setMsg("");
    try {
      const res = await axios.get(`http://localhost:5000/users/registered-after/${username}`);
      setResults(res.data);
    } catch (err) {
      setMsg("Error fetching users");
    }
  };
  return (
    <div>
      <h2>Registered After Username</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <button onClick={handleSearch}>Fetch</button>
      <div>{msg}</div>
      <ul>
        {results.map(u => (
          <li key={u._id}>{u.username} - Registered: {new Date(u.registerday).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}