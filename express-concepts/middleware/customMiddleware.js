const requestLogger = (req, res, next) => {
  // .toISOString() returns a string in simplified extended ISO format (according to universal time), which is always 24 or 27 characters long (YYYY-MM-DDTHH:mm:ss.sssZ or ±YYYYYY-MM-DDTHH:mm:ss.sssZ, respectively).
  const timeStamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  // req.get('User-Agent') returns the value of the User-Agent header field in the request. If the User-Agent header is not present, the method returns undefined.
  const userAgent = req.get("User-Agent");
  console.log(`[${timeStamp}] ${method} ${url} - ${userAgent}`);
  next();
};

const addTimeStamp = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
};

module.exports = { requestLogger, addTimeStamp };
