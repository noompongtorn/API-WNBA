const express = require("express");
const cors = require("cors"); // Import CORS package
const app = express();
const port = 3007;
const cron = require("node-cron");
const axios = require("axios");

// Import routes
const userRoutes = require("./router/users");
const historyRoutes = require("./router/histories");
const recordRoutes = require("./router/records");
const adminRoutes = require("./router/admins");
const roleRoutes = require("./router/roles");
const appRoutes = require("./router/app");

// Import database and other configs
const { connectDB } = require("./config/db");
const {
  fetchCurrentGameData,
  fetchNBAData,
} = require("./config/service/nba-service");

// Connect to the database
connectDB();

// Middleware (optional: for parsing JSON or static files)
app.use(
  cors({
    origin: [
      "http://ygevo.myvnc.com",
      "https://ygevo.myvnc.com",
      "http://localhost:3000",
    ], // Allow both production and local development
  })
);
app.use(express.json());

// Use the routes
app.use("/wnba/api/user", userRoutes);
app.use("/wnba/api/history", historyRoutes);
app.use("/wnba/api/record", recordRoutes);
app.use("/wnba/api/admin", adminRoutes);
app.use("/wnba/api/role", roleRoutes);
app.use("/wnba/api/v1/app", appRoutes);

// cron.schedule("0 * * * *", async () => {
//   try {
//     await axios.get(`http://ygevo.myvnc.com/nba/api/v1/app/nba`);
//   } catch (error) {}
// });

// cron.schedule("0 * * * *", async () => {
//   try {
//     await axios.get(`http://ygevo.myvnc.com/nba/api/v1/app/retry-nba`);
//   } catch (error) {}
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
