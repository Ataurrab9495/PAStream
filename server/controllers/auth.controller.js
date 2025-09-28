import { upsertStreamUser } from '../lib/stream.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json(
                {
                    message: 'All fields are required bachaa.'
                }
            )
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long.'
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format.'
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email is already in use.'
            })
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || '',
            });
            console.log(`User ${newUser._id} synced to Stream`);

        } catch (error) {
            console.log('Error syncing user to Stream:', error);
        }

        const token = jwt.sign({
            userId: newUser._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
            error: error.message,
        })
    };
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.'
            })
        }

        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password.'
            })
        }

        const isMatchPassword = await user.matchPassword(password);
        if (!isMatchPassword) {
            return res.status(400).json({
                message: 'Invalid email or password.'
            })
        }

        const token = jwt.sign({
            userId: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.cookie("meri-pratyaksha", token, {
        res.cookie("jwt", token, {
            httpOnly: true, // JS access prevention
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
            error,
        })
    }
};


export const logout = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({
        success: true,
        message: 'Logout successfully'
    })
}


export const onBoard = async (req, res) => {
    try {
        const userId = req.user._id;

        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: 'All fields are required.',
                missingFields: [
                    !fullName && 'fullName',
                    !bio && 'bio',
                    !nativeLanguage && 'nativeLanguage',
                    !learningLanguage && 'learningLanguage',
                    !location && 'location',
                ].filter(Boolean),
            });
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,
                isOnboarded: true,
            },
            { new: true }
        );

        if (!updateUser) {
            return res.status(404).json({
                message: 'User not found.'
            })
        };

        try {
            await upsertStreamUser({
                id: updateUser._id.toString(),
                name: updateUser.fullName,
                image: updateUser.profilePic || '',
            });
            log(`User ${updateUser.fullName} synced to Stream`);
        } catch (streamError) {
            console.log('Error syncing user to Stream:', streamError);
        }


        res.status(200).json({
            success: true,
            message: 'User onboarded successfully.',
            user: updateUser,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
            error: error.message,
        })
    };
}

