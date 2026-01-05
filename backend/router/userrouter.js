import express from 'express'
import { registerUser,loginUser,logoutUser } from '../controller/user.controller.js'
import { sendOtp,otpVerification,authenticate } from '../utils/otp/otp.js'
import { generateOtp } from '../utils/otp/generateOtp.js'
const authRouter=express.Router()
authRouter.post('/register',registerUser)
authRouter.post('/login',loginUser)
authRouter.post('/logout',logoutUser)
authRouter.post('/send-otp',sendOtp)
authRouter.post('/verify-otp',otpVerification)
authRouter.post('/generate-otp',generateOtp)
export default authRouter