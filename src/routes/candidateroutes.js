import express from "express";
import { Router } from "express";

import { createCandidate, authCandidate } from "../controllers/candidateController.js";
import { protect,protectcandidate } from "../middlewares/authMiddleware.js"; 
import { changePassword } from "../controllers/changecandidatepassword.js";
import Candidate from "../models/Candidate.models.js";



const router=Router()

router.post("/create", protect, createCandidate); 
router.post("/login", authCandidate); 
router.put("/changepassword",protectcandidate,changePassword); 
router.get("/offerletter/:candidateId", protectcandidate, async (req, res) => {
    try {
      const candidate = await Candidate.findById(req.params.candidateId);
      if (!candidate) return res.status(404).json({ message: "Candidate not found" });
  
      res.json({ offerLetter: candidate.offerLetter });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

export default router;