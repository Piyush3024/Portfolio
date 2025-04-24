import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import contactRoutes from "./routes/contact.route.js";
import projectRoutes from "./routes/project.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";


// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "https://piyushbhul.com.np",
    "https://www.piyushbhul.com.np"
  ],
  credentials: true
}));



app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      env: {
        nodeEnv: process.env.NODE_ENV,
        clientUrl: process.env.CLIENT_URL,
        // Don't expose sensitive info like DB credentials
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection has been established successfully.');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

// app.listen(PORT, () => {
//   console.log(`Server is running http://localhost:${PORT}`);
//   connectDB();
// });
