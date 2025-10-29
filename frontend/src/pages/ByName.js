import React, { useState } from "react";
import axios from "axios";
export default function ByName() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");
  const handleSearch = async () => {
    setMsg("");
    try {
      const res = await axios.get("http://localhost:5000/users/by-name", { params: { first, last } });
      setResults(res.data);
    } catch (err) {
      setMsg("Error searching by name");
    }
  };
  return (
    <div>
      <h2>Search by First/Last Name</h2>
      <input placeholder="First Name" value={first} onChange={e => setFirst(e.target.value)} />
      <input placeholder="Last Name" value={last} onChange={e => setLast(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <div>{msg}</div>
      <ul>
        {results.map(u => (
          <li key={u._id}>{u.username} - {u.firstname} {u.lastname}</li>
        ))}
      </ul>
    </div>
  );
}