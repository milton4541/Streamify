import FriendRequest from "../../models/FriendRequest.js";
import User from "../../models/User.js"

export async function getRecommendedUsers(req,res) {
    try {
        const currentUserId =  req.user.id
        const currentUser = req.user

        const recomemmendedUsers = await User.find({ //sintaxis moongose
            $and: [
                {_id: {$ne: currentUserId}},
                {$id: {$nin: currentUser.friends}},
                {isOnboarned: true},
            ],
        });
        res.status(200).json(recomemmendedUsers)
    } catch (error) {
        console.error("Error in getRecommendedUsers controller ", error.message)
        res.status(500).json({message: "internal server error"})
    }
}

export async function getMyFriends(req,res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilePic nativeLenguage learningLenguage")
        res.status(200).json(user.friends)
    } catch (error) {
        console.error("Error in getMyFriends controller ", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function sendFriendRequest(req,res) {
    try {
        const myId = req.user.id
        const {id:recipientId} = req.params

        //prevent sending req to yourself
        if(myId===recipientId) return res.status(400).json({message: "You can't send friend request to yourself"})

        const recipient = await User.findById(recipientId)
        if(!recipient) return res.status(400).json({message: "recipient not found"})
        //check if user already friends
        if(recipient.friends.includes(myId)) return res.status(400).json({message: "You are already friends with this user"})

        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId}
            ],
        });

        if(existingRequest){
            return res
                .status(400)
                .json({message:"A friend request already exists between you and this user"})
        }
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })

        res.status(201).json(friendRequest)
    } catch (error) {
        console.error("Error in sendFriendRequest Controller", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function acceptFriendRequest(req,res) {
    try {
        const {id:requestId} = req.params
        const friendRequest = await FriendRequest.findById(requestId)

        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message: "you are not authorized to accept this request"})
        }

        friendRequest.status = "accepted"
        await friendRequest.save()

        //add each user to the others friends array
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: {friends: friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: {friends: friendRequest.sender}
        })
        res.status(200).json({message: "Friends request accept"})
    } catch (error) {
        console.error("Error in acceptFriendRequest Controller", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}