import express from 'express'
import { createDepartment , deleteDepartment , editDepartment , getAllDepartment , getDepartmentById } from '../controllers/department.controller.js'

const router = express.Router()

router.post('/createdepartment' , createDepartment)
router.delete('/:id' , deleteDepartment)
router.put('/:id' , editDepartment)
router.get('/getalldepartment' , getAllDepartment)
router.get('/:id' , getDepartmentById)

export default router