import React, { useState } from "react";
import axios from "axios";
export default function BySalary() {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");
  const handleSearch = async () => {
    setMsg("");
    try {
      const res = await axios.get("http://localhost:5000/users/salary", { params: { min, max } });
      setResults(res.data);
    } catch (err) {
      setMsg("Error searching by salary");
    }
  };
  return (
    <div>
      <h2>Search by Salary</h2>
      <input type="number" placeholder="Min" value={min} onChange={e => setMin(e.target.value)} />
      <input type="number" placeholder="Max" value={max} onChange={e => setMax(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <div>{msg}</div>
      <ul>
        {results.map(u => (
          <li key={u._id}>{u.username} - Salary: {u.salary}</li>
        ))}
      </ul>
    </div>
  );
}