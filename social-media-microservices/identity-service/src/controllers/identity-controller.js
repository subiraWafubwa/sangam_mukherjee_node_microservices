const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

// User registration
const logger = require("../utils/logger");
const { validateRegistration } = require("../utils/registrationValidation");

const registerUser = async (req, res) => {
  logger.info("Registration endpoint hit...");
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { username, email, password } = req.body;
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({ username, email, password });
    await user.save();
    logger.warn("User saved successfully", user._id);

    const { accessToken, refreshToken } = await generateToken(user);
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    logger.error("Registration error occurred", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// log in, refresh token and logout

module.exports = { registerUser };
