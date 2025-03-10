import jwt from "jsonwebtoken";
import Hr from "../models/Hr.models.js";
import Candidate from "../models/Candidate.models.js";

const protect = async (req, res, next) => {
    let token;
  
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Hr.findById(decoded.id).select('-password');
        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  };
const protectcandidate = async (req, res, next) => {
    let token;
  
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Candidate.findById(decoded.id).select('-password');
        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  };
  let blacklistedTokens = [];

  export const blacklistToken = (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    blacklistedTokens.push(token);
    res.status(200).json({ message: "Logged out successfully" });
};

export {protect,protectcandidate};