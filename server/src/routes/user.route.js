import express from 'express'
import { login , logout , register , editUser , getUsersByOrganization , getCurrentUser } from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.middleware.js';


const router = express.Router()

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/edit/:userId", editUser);
router.get('/users' , getUsersByOrganization)
router.get('/me' , protect , getCurrentUser)

export default router