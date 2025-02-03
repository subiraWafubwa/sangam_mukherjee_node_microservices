class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const globalErrorHandler = (err, req, res, next) => {
  // stack trace helps to debug the error by providing the call stack where the error occurred
  console.error(err.stack);

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message,
    });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "Validation Error",
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: "Error",
      message: `Validation Error: ${err.message}`,
    });
  }
};

module.exports = { asyncHandler, globalErrorHandler, APIError };
