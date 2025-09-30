import pool from "../config/db.js";

// Create a new summary
export const createSummary = async (req, res) => {
  const userId = req.user?.id;
  const { title, content } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO summaries (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, content]
    );
    res.status(201).json({ summary: result.rows[0] });
  } catch (err) {
    console.error("createSummary error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all summaries of the logged-in user
export const listSummaries = async (req, res) => {
  const userId = req.user?.id;

  try {
    const result = await pool.query(
      "SELECT * FROM summaries WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json({ summaries: result.rows });
  } catch (err) {
    console.error("listSummaries error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a summary
export const updateSummary = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    // Build dynamic query
    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }
    if (content !== undefined) {
      fields.push(`content = $${idx++}`);
      values.push(content);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No valid fields provided to update" });
    }

    values.push(userId);
    values.push(id);

    const query = `UPDATE summaries SET ${fields.join(", ")}, updated_at = NOW() WHERE user_id = $${idx++} AND id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);

    if (!result.rows.length) return res.status(404).json({ error: "Summary not found" });

    res.json({ summary: result.rows[0] });
  } catch (err) {
    console.error("updateSummary error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a summary
export const deleteSummary = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM summaries WHERE user_id = $1 AND id = $2 RETURNING *",
      [userId, id]
    );

    if (!result.rows.length) return res.status(404).json({ error: "Summary not found" });

    res.json({ message: "Summary deleted successfully" });
  } catch (err) {
    console.error("deleteSummary error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
