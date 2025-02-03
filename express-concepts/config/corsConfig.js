const cors = require("cors");

const confugureCors = () => {
  return cors({
    // origin -> Shows which domains are allowed to access the server
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://youdomainexample.com",
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Access is allowed
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Version"],
    exposedHeaders: ["X-total-count", "Content-Range"],
    credentials: true, // Enable support for cookies
    preflightContinue: false,
    maxAge: 600, // cache preflight requests for 600 seconds -> avoid unnecessary OPTIONS requests
    optionsSuccessStatus: 204,
  });
};

module.exports = confugureCors;
