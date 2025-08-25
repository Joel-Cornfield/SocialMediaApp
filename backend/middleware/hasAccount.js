const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const myError = require("../lib/myError");

// Ensure user has an account and token is valid
const hasAccount = asyncHandler(async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new myError("Auth headers missing", 401);
  }

  const token = auth.split(" ")[1];  // Extract token
  if (!token) {
    throw new myError("No token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token asynchronously
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw new myError("User not found", 401);
    }

    req.user = user;  // Attach user info to the request object
    next();  // Proceed to next middleware
  } catch (err) {
    // Handle token-related errors
    if (err.name === "TokenExpiredError") {
      throw new myError("Token has expired. Please login again", 401);
    }
    throw new myError(err.message || "Failed to verify token", 401);
  }
});

module.exports = hasAccount;
