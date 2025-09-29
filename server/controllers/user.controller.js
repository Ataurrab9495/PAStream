import User from '../models/user.model.js';
import FriendRequest from '../models/friendRequest.model.js';

export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        // Fetch users who are not the current user and not already friends
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnboarded: true }
            ]
        });

        res.status(200).json({
            success: true,
            users: recommendedUsers,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
            error,
        })
    }
};


export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            })
        }

        return res.status(200).json({
            success: true,
            friends: user.friends,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
            error,
        })
    }
};



export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: recipientId } = req.params;

        // prevent sending request to yourself
        if (myId == recipientId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a friend request to yourself."
            })
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient user not found."
            });
        }

        // Check if a friend request already exists
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({
                message: "You are already friends with this user."
            })
        }

        //check if a req already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "A friend request already exists between you and this user."
            })
        }
        
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        return res.status(200).json({
            success: true,
            message: "Friend request sent successfully.",
            friendRequest,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
            error,
        })
    }
};



export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found."
            })
        }

        // verify the current user is the recipient
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this friend request."
            })
        }


        friendRequest.status = 'accepted';
        await friendRequest.save();

        // Add each other to friends list
        // $addToSet: adds elements to an array only if they do not already exist.
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });


        return res.status(200).json({
            success: true,
            message: "Friend request accepted.",
            friendRequest,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
            error,
        })
    }
};




export const getFriendRequests = async (req, res) => {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");

        return res.status(200).json({
            success: true,
            incomingReqs: incomingReqs,
            acceptedReqs: acceptedReqs,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
            error,
        })
    }
};



export const getOutgoingFriendReqs = async (req, res) => {
    try {
        const outgoindRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        return res.status(200).json({
            success: true,
            outgoingFriendReqs: outgoindRequests,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
            error,
        })
    }
};
