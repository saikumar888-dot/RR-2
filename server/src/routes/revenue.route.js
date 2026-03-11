import express from 'express';
import {
  createRevenue,
  updateRevenue,
  deleteRevenue,
  getRevenues,
  getRevenueByDepartment,
  getTotalRevenue,
} from '../controllers/revenue.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post('/' , protect ,  createRevenue)
router.put('/:id' , protect , updateRevenue)
router.delete('/:id' , protect , deleteRevenue)
router.get('/' , protect , getRevenues)
router.get('/department/:departmentId', protect, getRevenueByDepartment);
router.get('/analytics/total' , protect , getTotalRevenue)




export default router