import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// --- SIGNUP ---
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // check if user already exists
    const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rows.length) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email, created_at",
      [name, email, hashed]
    );

    const user = result.rows[0];
    const token = createToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- LOGIN ---
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (!result.rows.length) return res.status(400).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- UPDATE PROFILE ---
export const updateProfile = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { name, email, password } = req.body;

  try {
    // If email provided, ensure it's not used by another account
    if (email) {
      const q = "SELECT id FROM users WHERE email = $1 AND id <> $2";
      const existing = await pool.query(q, [email, userId]);
      if (existing.rows.length) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Build dynamic update query
    const fields = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(name);
    }
    if (email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (password !== undefined) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push(`password = $${idx++}`);
      values.push(hashed);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No valid fields provided to update" });
    }

    values.push(userId);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, name, email, created_at, updated_at`;
    const result = await pool.query(query, values);

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
