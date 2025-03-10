import Hr from "../models/Hr.models.js";
import { generateToken } from "../utils/generatetoken.js";
import mongoose from "mongoose";

const registerHr = async (req, res) => {
  const { name, email, password, companyName, registrationKey } = req.body;

  if (registrationKey !== process.env.HR_REGISTRATION_KEY) {
    return res.status(400).json({ message: "Invalid registration key" });
  }

  const hrExists = await Hr.findOne({ email });

  if (hrExists) {
    return res.status(400).json({ message: "HR already exists" });
  }

  const hr = await Hr.create({ name, email, password, companyName });

  if (hr) {
    res.status(201).json({
      _id: hr._id,
      name: hr.name,
      email: hr.email,
      companyName: hr.companyName,
      token: generateToken(hr._id),
    });
  } else {
    res.status(400).json({ message: "Invalid HR data" });
  }
};

const authHr = async (req, res) => {
  const { email, password } = req.body;

  const hr = await Hr.findOne({ email });

  if (hr && (await hr.matchPassword(password))) {
    res.json({
      _id: hr._id,
      name: hr.name,
      email: hr.email,
      companyName: hr.companyName,
      token: generateToken(hr._id),
      message:"logged in successfully"
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

const logoutHr = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

export { registerHr, authHr, logoutHr };
