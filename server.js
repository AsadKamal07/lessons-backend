import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";

dotenv.config({ path: ".env", debug: false });
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/summaries", summaryRoutes);


// basic error handler
app.use((err, res) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server Successfully running on ${PORT}`));
