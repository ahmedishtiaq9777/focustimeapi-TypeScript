import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./src/config/sequelize";
import { errorLogger } from "./src/middleware/errorlogger";
import { initNotificationService } from "./src/services/notificationService";

import taskRoutes from "./src/routes/taskRoutes";
import authRoutes from "./src/routes/authRoutes";
import userRoutes from "./src/routes/userRoutes";
import adminRoutes from "./src/routes/adminRoutes";
import notificationRoutes from "./src/routes/notificationRoutes";

// Initialize Express app
const app: Application = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});
// socket connection
initNotificationService(io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//routes

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api", notificationRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 FocusTime API is running...");
});

// app.use(errorLogger);

// ✅ Database connection
sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ Database connected successfully.");

    // Sync models if needed
    await sequelize.sync({ alter: false });
  })
  .catch((err: any) => {
    console.error("❌ Database connection failed:", err);
  });

const PORT = process.env.PORT || 8092;
server.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});
