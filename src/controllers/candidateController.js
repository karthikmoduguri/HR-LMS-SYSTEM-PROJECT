import Candidate from "../models/Candidate.models.js";
import { generateToken } from "../utils/generatetoken.js";  
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Hr from "../models/Hr.models.js";
import { generatePassword, generateCandidateId } from "../utils/generateCredentials.js";
import { sendEmail } from "../utils/emailservice.js";
import fs from "fs";
import path from "path";
import upload from "../middlewares/multermiddleware.js";
import cloudinary from "../utils/cloudinary.js";
import dotenv from "dotenv";

dotenv.config();
const generateOfferLetter = (candidate) => {
  return `
    <h2>Offer Letter</h2>
    <p>Dear ${candidate.name},</p>
    <p>We are pleased to offer you a position at our company.</p>
    <p>Team: ${candidate.team}</p>
    <p>We look forward to working with you!</p>
    <p>Best Regards,<br>${candidate.hr.companyName}</p>
  `;
};

const createCandidate = async (req, res) => {
  try {
    const { name, email, team, socialMedia } = req.body;
    const hrId = req.user.id;

    const hr = await Hr.findById(hrId);
    if (!hr) return res.status(404).json({ message: "HR not found" });

    const candidateExists = await Candidate.findOne({ email });
    if (candidateExists) return res.status(400).json({ message: "Candidate already exists" });

    const candidateId = generateCandidateId();
    let password = generatePassword();

    const candidate = await Candidate.create({
      hr: hrId,
      name,
      email,
      password: password,
      team,
      socialMedia,
    });

    // ✅ Generate Offer Letter
    const offerLetterHtml = generateOfferLetter(candidate);

    // ✅ Save as Temporary HTML File
    const tempFilePath = path.join(process.cwd(), "temp", `${candidate.name}_offer.html`);
    fs.writeFileSync(tempFilePath, offerLetterHtml);

    try {
      
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      console.log(cloudinary.config());
      console.log("Uploading to Cloudinary:", tempFilePath);
      
      // ✅ Upload to Cloudinary
      const cloudinaryRes = await cloudinary.uploader.upload(tempFilePath, {
        folder: "offer_letters",
        resource_type: "auto",
      });

      console.log("Cloudinary Upload Success:", cloudinaryRes);
      candidate.offerLetter = cloudinaryRes.secure_url;
      await candidate.save();

      hr.candidates.push(candidate._id);
      await hr.save();

      // ✅ Send Email with Credentials
      const emailContent = `
        <h3>Welcome to ${hr.companyName}</h3>
        <p>Your Candidate ID: <strong>${candidateId}</strong></p>
        <p>Your Password: <strong>${password}</strong></p>
        <p>Use these credentials to log in.</p>
      `;
      await sendEmail(email, "Your Candidate Login Credentials", emailContent);

      // ✅ Delete Temporary File
      fs.unlinkSync(tempFilePath);

      res.status(201).json({
        message: "Candidate profile created, offer letter uploaded, and credentials sent.",
        candidateId,
      });
    } catch (uploadErr) {
      console.error("Cloudinary Upload Error:", uploadErr);
      res.status(500).json({ message: "Cloudinary upload failed", error: uploadErr });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

  

  const authCandidate = async (req, res) => {
    const { email, password } = req.body;
  
    const candidate = await Candidate.findOne({ email });
    // console.log(candidate);
    console.log(req.body.email);
    console.log(req.body.password);
    if (candidate && (await bcrypt.compare(password, candidate.password))) {
      res.json({
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        team: candidate.team,
        token: generateToken(candidate._id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  };
  
  export { createCandidate, authCandidate };