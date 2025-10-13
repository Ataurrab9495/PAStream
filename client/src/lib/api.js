import {axiosInstance} from "./axios";

export const signup = async(signupData) => {
    const res = await axiosInstance.post('/auth/signup', signupData);
    if (res.data.token) {
        localStorage.setItem('token', res.data.token);
    }
    return res.data;
};

export const login = async(loginData) => {
    const res = await axiosInstance.post('/auth/login', loginData);
    if (res.data.token) {
        localStorage.setItem('token', res.data.token);
    }
    return res.data;
};

export const logout = async() => {
    const res = await axiosInstance.post('/auth/logout');
    localStorage.removeItem('token');
    return res.data;
};


export const getAuthUser = async() => {
    try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const completeOnboarding = async(userData) => {
    const res = await axiosInstance.post('/auth/onboarding', userData);
    return res.data;
};


export const getUserFriends = async() => {
    const res = await axiosInstance.get('/users/friends');
    return res.data;
};


export const getRecommendedUsers = async() => {
    const res = await axiosInstance.get('/users');
    return res.data;
};

export const getOutgoingFriendReqs = async() => {
    const res = await axiosInstance.get('/users/outgoing-friend-requests');
    return res.data;
};

export const sendFriendRequest = async(userId) => {
    const res = await axiosInstance.post(`/users/friend-request/${userId}`)
    return res.data;
};


export const getFriendRequests = async() => {
    const res = await axiosInstance.get("/users/friend-requests");
    return res.data;
};

export const acceptFriendRequest = async(requestId) => {
    const res = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
    return res.data;
};


export const getStreamToken = async() => {
    const res = await axiosInstance.get("/chat/token");
    return res.data;
};

// user data update
export const updateUserData = async(data) => {
    const res = await axiosInstance.put("/users/update-userdata", data);
    return res.data;
}