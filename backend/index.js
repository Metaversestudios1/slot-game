const express = require("express");
const cors = require("cors");
const app = express();
const GameRoute = require("./routes/GameRoute");
const connectDB = require("./config/db");

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // <-- Add this line to parse JSON request bodies

// Routes
app.get("/api/getHello", (req, res) => {
  res.status(200).json({ message: "hi this is testing server" });
});

const AdminRoute = require("./routes/AdminRoute");
const UserRoute = require("./routes/UserRoute");
app.use('/api',UserRoute);
app.use('/api', AdminRoute);
app.use('/api', GameRoute);


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${8000}`);
});
