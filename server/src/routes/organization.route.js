import express from 'express'
import { createOrganization , editOrganization , deleteOrganization , getAllOrganizations , getOrganizationById } from '../controllers/organization.controller.js'

const router = express.Router()

router.post('/createorganization' , createOrganization)
router.delete('/:id' , deleteOrganization)
router.put('/:id' , editOrganization)
router.get('/getallorgs' , getAllOrganizations)
router.get('/getOrganizationById/:id' , getOrganizationById )



export default router