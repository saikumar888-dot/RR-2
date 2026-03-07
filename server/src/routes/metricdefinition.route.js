import express from 'express';
import { createMetricDefinition , getMetricsByFeature } from '../controllers/metrics.controller.js';
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/' , protect , createMetricDefinition)
router.get('/feature/:featureId' , protect , getMetricsByFeature)

export default router