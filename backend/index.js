const express = require("express");
const cors = require("cors");
const app = express();
const GameRoute = require("./routes/GameRoute");
const connectDB = require("./config/db");

// Connect to database
connectDB();

// Middleware
app.use(cors());
const corsOption = {
  origin: "http://localhost:3001",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  credentials: true,
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 204
}
 
app.options('*', cors(corsOption));
// Enable CORS with specific options
app.use(cors(corsOption)); 
app.use(express.json()); // <-- Add this line to parse JSON request bodies


app.use('/', async (req, res) => {
  
  res.json('ok');

});
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
