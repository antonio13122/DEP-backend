const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  // Extract the token, ensure it's a Bearer token format
  let token = req.header("Authorization");

  // Check if the token exists
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // If the token is prefixed with 'Bearer ', remove it
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); // Remove "Bearer " part
  }

  // Log the token for debugging
  console.log("Received token:", token);

  try {
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded user info for debugging
    console.log("Decoded user:", decoded);

    // Attach the decoded user information to the request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error); // Log detailed error
    return res.status(401).json({ message: "Invalid token" });
  }
};
