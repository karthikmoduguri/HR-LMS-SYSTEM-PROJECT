import express from "express";
import { registerHr, authHr, logoutHr } from "../controllers/Hrcontroller.js";
import { Router } from "express";
import { blacklistToken} from "../middlewares/authMiddleware.js";  
const router=Router()
router.post("/register", registerHr); 
router.post("/login", authHr); 
router.post("/logout",blacklistToken, logoutHr); 

export default router;
