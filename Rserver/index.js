import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DB connect ---
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB connected");

// schema

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // hashed
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    salary: { type: Number },
    age: { type: Number },
    registerday: { type: Date, default: () => new Date() },
    signintime: { type: Date, default: null }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

// --- Helpers for date-range queries ---
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDayRange = (d) => {
  const start = startOfDay(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { $gte: start, $lt: end };
};

// ------------------- ROUTES -------------------

// Root / health
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend is up 👋" });
});

// (1) Registration
app.post("/register", async (req, res) => {
  try {
    const { username, password, firstname, lastname, salary, age } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username & password required" });
    }
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ error: "username already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hash,
      firstname,
      lastname,
      salary,
      age,
      registerday: new Date()
    });
    res.status(201).json({ ok: true, username });
  } catch (e) {
    res.status(500).json({ error: "register failed", details: e.message });
  }
});

// (2) Sign-in (updates signintime)
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const u = await User.findOne({ username });
    if (!u || !(await bcrypt.compare(password, u.password))) {
      return res.status(401).json({ error: "invalid credentials" });
    }
    u.signintime = new Date();
    await u.save();
    res.json({ ok: true, username: u.username, signintime: u.signintime });
  } catch (e) {
    res.status(500).json({ error: "login failed", details: e.message });
  }
});

// (3) Search by first and/or last name (prefix LIKE 'X%'), no regex
app.get("/users/by-name", async (req, res) => {
  const { first, last } = req.query;
  const q = {};
  if (first) q.firstname = { $gte: first, $lt: first + "\uffff" };
  if (last) q.lastname = { $gte: last, $lt: last + "\uffff" };
  const users = await User.find(q).select("-password");
  res.json(users);
});

// (4) Search by userid (username)
app.get("/users/by-username/:username", async (req, res) => {
  const u = await User.findOne({ username: req.params.username }).select("-password");
  if (!u) return res.status(404).json({ error: "not found" });
  res.json(u);
});

// (5) Salary between X and Y
app.get("/users/salary", async (req, res) => {
  const min = Number(req.query.min ?? 0);
  const max = Number(req.query.max ?? Number.MAX_SAFE_INTEGER);
  const users = await User.find({ salary: { $gte: min, $lte: max } }).select("-password");
  res.json(users);
});

// (6) Age between X and Y
app.get("/users/age", async (req, res) => {
  const min = Number(req.query.min ?? 0);
  const max = Number(req.query.max ?? Number.MAX_SAFE_INTEGER);
  const users = await User.find({ age: { $gte: min, $lte: max } }).select("-password");
  res.json(users);
});

// (7) Registered after {username}
app.get("/users/registered-after/:username", async (req, res) => {
  const ref = await User.findOne({ username: req.params.username });
  if (!ref) return res.status(404).json({ error: "reference user not found" });
  const users = await User.find({ registerday: { $gt: ref.registerday } }).select("-password");
  res.json(users);
});

// (8) Users who never signed in
app.get("/users/never-signed-in", async (_req, res) => {
  const users = await User.find({
    $or: [{ signintime: null }, { signintime: { $exists: false } }]
  }).select("-password");
  res.json(users);
});

// (9) Registered on same day as {username}
app.get("/users/same-day-as/:username", async (req, res) => {
  const ref = await User.findOne({ username: req.params.username });
  if (!ref) return res.status(404).json({ error: "reference user not found" });
  const users = await User.find({ registerday: sameDayRange(ref.registerday) }).select("-password");
  res.json(users);
});

// (10) Registered today
app.get("/users/registered-today", async (_req, res) => {
  const users = await User.find({ registerday: sameDayRange(new Date()) }).select("-password");
  res.json(users);
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 backend running on http://localhost:${PORT}`);
});
