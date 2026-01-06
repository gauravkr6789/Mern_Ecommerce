import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDb from './Database/dbConfig.js'
import authRouter from './router/userrouter.js'
console.log("PORT :",process.env.PORT)
const app=express()
app.use(express.json())
//router
app.use('/api/auth',authRouter)
//database connection
connectDb()
app.listen(process.env.PORT,()=>{
    console.log(`server running on port :${process.env.PORT}`)
})