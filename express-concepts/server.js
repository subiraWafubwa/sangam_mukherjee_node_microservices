require("dotenv").config();
const express = require("express");
const configureCors = require("./config/corsConfig");
const {
  requestLogger,
  addTimeStamp,
} = require("./middleware/customMiddleware");
const { globalErrorHandler } = require("./middleware/errorHandler");
const { urlVersioning } = require("./middleware/apiVersioning");
const { createBasicRateLimiter } = require("./middleware/rateLimiting");
const itemRoutes = require("./routes/itemRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(configureCors());
app.use(express.json());
app.use(requestLogger); //Log the incoming request
app.use(addTimeStamp); // Add timestamp to the request object
app.use(createBasicRateLimiter(100, 15 * 60 * 1000)); // Using a rate limiter (100 requests per 15 minutes)

app.use(urlVersioning("v1")); // Use url-versioning for API
app.use("/api/v1", itemRoutes);

app.use(globalErrorHandler); //Handle errors globally

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
