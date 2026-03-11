import express from 'express'
import { createDepartment , deleteDepartment , editDepartment , getAllDepartment , getDepartmentById , getDepartmentExpense , getCashFlow} from '../controllers/department.controller.js'
import { getDepartmentRevenue } from '../controllers/department.controller.js'
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router()

router.post('/createdepartment' , createDepartment)
router.delete('/:id' , deleteDepartment)
router.put('/:id' , editDepartment)
router.get('/getalldepartment' , getAllDepartment)
router.get("/analytics/cashflow", protect ,  getCashFlow);
router.get('/:id' , getDepartmentById)
router.get('/:departmentId/expenses' , getDepartmentExpense)
router.get('/:departmentId/revenues', getDepartmentRevenue);

export default router