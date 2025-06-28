import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { acceptFriendRequest, getMyFriends, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js"

const router =  express.router()

router.use(protectRoute)
router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)

router.post("/friends-request/:id", sendFriendRequest)
router.put("/friends-request/:id/accept", acceptFriendRequest)

export default router