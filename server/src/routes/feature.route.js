import express from "express";
import { createFeature, getFeatures } from "../controllers/feature.controller.js";
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/" , protect , createFeature);
router.get("/" , protect , getFeatures)

export default router