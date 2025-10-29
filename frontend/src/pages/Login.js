import React, { useState } from "react";
import axios from "axios";
export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/login", form);
      setMsg("Welcome " + res.data.username + ", signed in at " + new Date(res.data.signintime).toLocaleString());
    } catch (err) {
      setMsg(err.response?.data?.error || "Error");
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}