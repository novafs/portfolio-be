import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import projectRoutes from "./src/routes/projectRoutes.js";
import techRoutes from "./src/routes/techRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import certificationTypeRoutes from "./src/routes/certificationTypeRoutes.js";
import certificationRoutes from "./src/routes/certificationRoutes.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());

// Security middleware
app.use(
  cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(helmet());

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/techs", techRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/certification-types", certificationTypeRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/messages", messageRoutes);


// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Latihan Backend API",
    documentation: "/api-docs",
  });
});

// Initialize Swagger
// setupSwagger();

app.listen(port, () => {
  console.log("Server running on localhost:" + port);
});
