const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const path = require("path");

// Routes
const documentRoutes =
  require("./routes/document.routes");

// Middlewares
const errorMiddleware =
  require("./middlewares/error.middleware");

const notFoundMiddleware =
  require("./middlewares/notFound.middleware");

const requestIdMiddleware =
  require("./middlewares/requestId.middleware");


  const authRoutes =
  require(
    "./models/auth/auth.routes"
  );


const {
  apiLimiter
} = require(
  "./middlewares/rateLimit.middleware"
);

/**
 * =====================================
 * Express App
 * =====================================
 */
const app = express();

/**
 * =====================================
 * Trust Proxy
 * Required for:
 * - Railway
 * - Render
 * - Nginx
 * - Cloudflare
 * =====================================
 */
app.set(
  "trust proxy",
  1
);

/**
 * =====================================
 * Security Headers
 * =====================================
 */
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);

/**
 * =====================================
 * CORS
 * =====================================
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL, // Vercel URL
    ],
    credentials: true,
  })
);

/**
 * =====================================
 * Request Logging
 * =====================================
 */
app.use(
  morgan("dev")
);

/**
 * =====================================
 * JSON Parser
 * =====================================
 */
app.use(
  express.json()
);

/**
 * =====================================
 * Response Compression
 * =====================================
 */
app.use(
  compression()
);

/**
 * =====================================
 * Request Tracking
 * Adds:
 * X-Request-Id
 * =====================================
 */
app.use(
  requestIdMiddleware
);

/**
 * =====================================
 * API Rate Limiting
 * =====================================
 */
app.use(
  "/api",
  apiLimiter
);

/**
 * =====================================
 * Static Uploads
 * =====================================
 */
// app.use(
//   "/uploads",
//   express.static(
//     path.join(
//       __dirname,
//       "../uploads"
//     )
//   )
// );


app.use(
  "/api/v1/auth",
  authRoutes
);

/**
 * =====================================
 * API Routes
 * =====================================
 */
app.use(
  "/api/v1/documents",
  documentRoutes
);

/**
 * =====================================
 * 404 Handler
 * =====================================
 */
app.use(
  notFoundMiddleware
);

/**
 * =====================================
 * Global Error Handler
 * =====================================
 */
app.use(
  errorMiddleware
);

module.exports = app;