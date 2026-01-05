import express from 'express'
import dotenv from 'dotenv'
import connectDb from './Database/dbConfig.js'
import authRouter from './router/userrouter.js'
dotenv.config()
const app=express()
app.use(express.json())
//router
app.use('/api/auth',authRouter)
//database connection
connectDb()
app.listen(process.env.PORT,()=>{
    console.log(`server running on port :${process.env.PORT}`)
})