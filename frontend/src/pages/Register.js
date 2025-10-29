import React, { useState } from "react";
import axios from "axios";
export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", firstname: "", lastname: "", salary: "", age: "" });
  const [msg, setMsg] = useState("");
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/register", form);
      setMsg("Registered: " + res.data.username);
    } catch (err) {
      setMsg(err.response?.data?.error || "Error");
    }
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="firstname" placeholder="First Name" value={form.firstname} onChange={handleChange} />
        <input name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleChange} />
        <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}