import mongoose from "mongoose"

export const connectBD = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB: ${conn.connection.host}`)
    }catch(error){
        console.log("Error in connect to mongoDB", error)
        process.exit(1)
    }
}