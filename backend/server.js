const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const pollRoutes = require("./routes/pollRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const packingRoutes = require("./routes/packingRoutes");
const taskRoutes = require("./routes/taskRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const voteRoutes = require("./routes/voteRoutes");
const documentRoutes = require("./routes/documentRoutes");
const emergencyContactRoutes = require("./routes/emergencyContactRoutes");
const journalRoutes = require("./routes/journalRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/packing", packingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/emergency-contacts", emergencyContactRoutes);
app.use("/api/journals", journalRoutes);
mongoose.connect("mongodb://localhost:27017/CrewTripDb")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });

app.get("/", (req, res) => {
    res.send("CrewTrip Backend is running!");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});