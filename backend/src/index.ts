import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { validationResult } from "express-validator";

require("dotenv").config({ path: "../.env" });
const port = process.env.PORT || 5000;
const app = express();

import dbo from "./database/conn";

import healthchecker from "./controller/healthchecker";
import { victoriaRouter } from "./controller/victoriaController";
import { rifflandiaRouter } from "./controller/rifflandiaController";
import { jamBaseRouter } from "./controller/jamBaseController";
import { playlistRouter } from "./controller/playlistController";
import { refreshTokenRouter } from "./refreshToken/refreshTokenRouter";

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "https://recordshop.cool", "https://record-shop-backend-n97z.onrender.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://recordshop.cool"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://recordshop.cool"],
      imgSrc: ["'self'", "data:", "https:", "https://recordshop.cool"],
      connectSrc: ["'self'", "https://accounts.spotify.com", "https://api.spotify.com", "https://recordshop.cool", "https://record-shop-backend-n97z.onrender.com"],
      fontSrc: ["'self'", "https://recordshop.cool"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https://recordshop.cool"],
      frameSrc: ["'none'"],
      sandbox: ["allow-forms", "allow-scripts", "allow-same-origin"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));

// Configure CORS with specific origin
app.use(cors({
  origin: ["https://recordshop.cool", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  credentials: true,
  exposedHeaders: ["Content-Range", "X-Content-Range"]
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all routes
app.use(limiter);

// Request size limits
app.use(express.json({ limit: '10kb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Limit URL-encoded payload size

// Validation middleware
app.use((req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      error: "Validation failed", 
      details: errors.array() 
    });
  }
  next();
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  
  // Don't send error details in production
  const errorResponse = process.env.NODE_ENV === 'production' 
    ? { success: false, error: "Internal Server Error" }
    : { success: false, error: err.message, stack: err.stack };

  res.status(500).json(errorResponse);
});

// Routes
app.use("/", healthchecker);
app.use(refreshTokenRouter);
app.use(victoriaRouter);
app.use(rifflandiaRouter);
app.use(jamBaseRouter);
app.use(playlistRouter);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ 
    success: false, 
    error: "Not Found" 
  });
});

app.listen(port, async () => {
  // perform a database connection when server starts
  await dbo.connectToServer(function (err: any) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
