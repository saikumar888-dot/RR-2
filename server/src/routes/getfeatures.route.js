import express from 'express';
import { getFeatureFullData , getOrganizationDashboard } from '../controllers/getfeaturedata.controlller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router()

router.get('/orgdashboard' , protect , getOrganizationDashboard)
router.get('/:featureId' , protect , getFeatureFullData)

export default router