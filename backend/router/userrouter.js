import express from 'express'
import { registerUser,loginUser,logoutUser } from '../controller/user.controller.js'
const authRouter=express.Router()
authRouter.post('/register',registerUser)
authRouter.post('/login',loginUser)
authRouter.post('/logout',logoutUser)

export default authRouter