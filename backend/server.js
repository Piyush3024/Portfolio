
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { PrismaClient } from '@prisma/client';
import passport from 'passport'; // Add passport
import session from 'express-session'; // Add session support
import passportSetup from './lib/passport-config.js'; 
import './lib/passport-config.js'

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

// Improved CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "https://portfoliofrontend-ui5y.onrender.com",
  "https://portfoliofrontend-production-4246.up.railway.app",
  "https://piyushbhul.com.np",
  "https://www.piyushbhul.com.np",
  "https://api.piyushbhul.com.np",
  "http://localhost:5000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Blocked request from disallowed origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());

// Session configuration (required for OAuth strategies)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Configure passport serialization (add this)
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: id },
      include: { role: true }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Other middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Cookies:', req.cookies);
  console.log('Auth Header:', req.headers.authorization);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Portfolio backend API is running',
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/contact", contactRoutes);
app.use("/project", projectRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

// Error handling
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

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));

// Start server
async function startServer() {
  try {
    await prisma.$connect();
    console.log(`Database connection established: ${process.env.DATABASE_URL}`);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Client URL: ${process.env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();