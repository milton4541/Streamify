import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import cors from "cors"
import { connectBD } from "../lib/db.js"
const app = express()
const PORT = process.env.PORT
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)


app.listen(PORT, ()=>{
    console.log(`server running in this port ${PORT}`)
    connectBD()
});