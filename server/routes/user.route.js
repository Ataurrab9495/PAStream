import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest, updateUser } from '../controllers/user.controller.js';

const app = express.Router();

app.use(authenticate);

app.get('/', getRecommendedUsers);
app.get('/friends', getMyFriends);

app.post('/friend-request/:id', sendFriendRequest);
app.put('/friend-request/:id/accept', acceptFriendRequest);

app.get('/friend-requests', getFriendRequests);
app.get('/outgoing-friend-requests', getOutgoingFriendReqs);

// still not applied on frontend
app.put('/update-userdata', updateUser);

export default app;