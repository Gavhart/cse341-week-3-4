const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/items");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
  })
);

// Passport for OAuth 2.0
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// Swagger API Documentation
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ItemUserManager API",
      version: "1.0.0",
      description: "API documentation for ItemUserManager"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./routes/*.js"], // pointing to where your routes are documented
};
const swaggerDocs = swaggerJsDoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ItemUserManager API",
      version: "1.0.0",
      description: "API documentation for ItemUserManager",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"], // Ensure your route files are located according to this pattern
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Connection error", err.message);
  });