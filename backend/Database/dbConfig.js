import mongoose from 'mongoose'
const connectDb=async()=>{
    try{
        const connect=await mongoose.connect(process.env.MONGO_URL)
        if(connect){
            console.log(`database connection succeefull : ${mongoose.connection.host}`)
        }
        else{
            console.log("database connection failed !!!")
        }

    }
    catch(err){
        console.log(`database connection error : ${err.message}`)

    }
}

export default connectDb