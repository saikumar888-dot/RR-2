import express from 'express';
import { addMetricsData , getLatestMetricData , getMetricDataByMetric , getMetricDataWithMetric } from '../controllers/metricsdata.controller.js';
import { protect } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/' , protect , addMetricsData)
router.get('/metrics/:metricId' , protect , getMetricDataByMetric)
router.get('/latest/:metricId' , protect , getLatestMetricData)
router.get('/metricsname/:metricId' , protect , getMetricDataWithMetric)

export default router