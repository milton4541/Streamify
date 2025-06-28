import { upsertStreamUser } from "../../lib/stream.js";
import User from "../../models/User.js";
import jwt from "jsonwebtoken"
//import process from "node:env"

export async function signup(req,res){
const {email,password,fullName} = req.body
try {
    if(!email || !password || !fullName){
        return res.status(400).json({message: "All fields are required"})
    }
    if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters"})
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({message: "Email already exist, please use a diffrent one"})
    }
    const idx = Math.floor(Math.random()*100)+1
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    const profilePic = randomAvatar
    const newUser = await User.create({
        email,
        fullName,
        password,
        profilePic
    })

    try {
        await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || "",
        })
        console.log(`User created correctly at ${newUser.fullName}`)      
    } catch (error) {
        console.error("error to creating stream user", error)
    }

    const token = jwt.sign({userId: newUser._id},process.env.JWT_SECRET_KEY,{
        expiresIn: "7d"
    })
    res.cookie("jwt",token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    })
    res.status(200).json({success: true, user: newUser})
} catch (error) {
    console.log("Error in signup controller", error)
    res.status(500).json({message: "Internal server error"})
}
}
export async function login(req,res){
    try {
        const {email, password} = req.body
        if(!email || !password) return res.status(400).json({message: "All fields are required"})
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({message: "invalid email or password"})
        const isPasswordCorrect = await user.matchPassword(password)
        if(!isPasswordCorrect) return res.status(401).json({message: "invalid email or password"})
        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET_KEY,{
        expiresIn: "7d"
        })
        res.cookie("jwt",token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })
        res.status(200).json({success: true, user})
    } catch (error) {
        console.log("Error in login controller", error)
        res.status(500).json({message: "Internal server error"})
    }
}
export function logout(req,res){
    res.clearCookie("jwt")
    res.status(200).json({success:true, message: "Logout Success"})
}
export async function onboard(req,res){
    try {
        const userId = req.user._id
        const {fullName, bio, nativeLenguage, learningLenguage, location} = req.body
        if(!fullName || !bio || !nativeLenguage || !learningLenguage || !location){
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLenguage && "nativeLenguage",
                    !learningLenguage && "learningLenguage",
                    !location && "location"
                ].filter(Boolean),
            })
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarned: true
        },{new:true})
        
        if(!updatedUser) return res.status(400).json({message: "User not found"})
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.name,
                image: updatedUser.profilePic || " "
            })
            console.log(`Stream User Updated after onboarding for ${updatedUser.fullName} `)
        } catch (streamError) {
            console.error("Error at stream upsert onboard: ", streamError.message)
        } 
        res.status(200).json({success: true, user: updatedUser})
    } catch (error) {
        console.error("Onboarding error: ", error)
        res.status(500).json({message: "internal server error"})
    }
}