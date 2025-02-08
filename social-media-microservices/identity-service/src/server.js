// Packages
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const logger = require("./utils/logger");
const helmet = require("helmet");
const cors = require("cors");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");

// File Imports
const router = require("./routes/identity-route");
const errorHandler = require("./middlewares/errorHandler");
const redisClient = new Redis(process.env.REDIS_URI);

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB!"))
  .catch((e) => logger.error("Mongo Connection error", e));

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

// DDOS Protection (Global Rate Limiter)
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch((e) => {
      logger.warn(`Rate limit exceed for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: `Too many requests` });
    });
});

// IP-based rate limiting for sensitive endpoints
const sensitiveRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: `Too many requests` });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

// Apply sensitive Endpoint limiter to the routes
app.use("/api/auth", sensitiveRateLimit, router);

// Error-Handler
app.use(errorHandler);

app.listen(process.env.PORT, process.env.IP_ADDRESS, () => {
  logger.info(`Identify service runnning on PORT ${process.env.PORT}`);
});

// Unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejction at ${promise}.\n Reason: ${reason}`);
});
