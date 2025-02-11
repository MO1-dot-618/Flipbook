const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

// Set up storage for uploaded PDFs
const storage = multer.diskStorage({
  destination: "uploads/", // Store in 'uploads' folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Serve static files from public folder
app.use(express.static("public"));

// Serve static files from uploads folder
app.use("/uploads", express.static("uploads"));

// Upload route
app.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Return the file path for use in the frontend
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
