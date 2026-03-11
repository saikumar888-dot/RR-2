import express from 'express'
import { retrieveActivity } from "../controllers/activity.controller.js";

const router = express.Router()

router.get('/getacts/:organizationId' , retrieveActivity)

export default router 