import bcrypt from "bcryptjs";

import Candidate from "../models/Candidate.models.js";
import { generateToken } from "../utils/generatetoken.js";  
import mongoose from "mongoose";
import Hr from "../models/Hr.models.js";
import { generatePassword, generateCandidateId } from "../utils/generateCredentials.js";
import { sendEmail } from "../utils/emailservice.js";

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const candidateId = req.user.id; // Candidate ID from authenticated token
  
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
  
    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, candidate.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
  
    // // Hash and update new password
    // const salt = await bcrypt.genSalt(10);
    // candidate.password = await bcrypt.hash(newPassword, salt);
    candidate.password = newPassword;
    await candidate.save();
  
    res.status(200).json({ message: "Password updated successfully" });
  };