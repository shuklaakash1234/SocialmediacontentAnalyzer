require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// -------------------------
// 1) API ROUTES
// -------------------------
const uploadsDir = path.join(__dirname, "uploads");
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {}
app.use("/api/analyze", require("./routes/analyze"));


const staticDir = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(staticDir));


app.get(/.*/, (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});


// -------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
