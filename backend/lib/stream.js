import {StreamChat} from "stream-chat"
import "dotenv/config.js"

const apiKey =  process.env.STEAM_API_KEY
const apiSecret = process.env.STEAM_API_SECRET

if(!apiKey || !apiSecret){console.error("Stream API key is missing")}
const streamCient = StreamChat.getInstance(apiKey,apiSecret)

export const upsertStreamUser = async (userData) => {
    try {
        await streamCient.upsertUser(userData)
        return userData
    } catch (error) {
        console.error("Error upserting stream user", error)
    }
}

//export const generateStreamToken = {userId} => {};