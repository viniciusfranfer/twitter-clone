import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if(!token) {
      return res.status(401).json({error: "Unauthorized access: No Token Porvided"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) {
      return res.status(401).json({error: "Unauthorized access: Invalid Token"});
    }

    const user = await User.findById(decoded.userId).select("-password");

    if(!user) {
      return res.status(401).json({error: "No user found"});
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in protectRoute middleware: ${error.message}`);
    res.status(500).json({error: "Internal server error"});
  }
}