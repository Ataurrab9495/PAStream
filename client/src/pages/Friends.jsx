import React, { useEffect, useState } from 'react'
import { useThemeStore } from '../store/useThemeStore'
import { THEMES } from '../constants'
import { Check, X } from 'lucide-react';
import moment from 'moment';
import { getOutgoingFriendReqs, getUserFriends } from '../lib/api';
import { useQuery } from '@tanstack/react-query';

const Friends = () => {
    const [activeTab, setActiveTab] = useState('friends');


    const themeName = useThemeStore((s) => s.theme);

    // find theme definition from constants
    const themeDef = THEMES.find((t) => t.name === themeName) || THEMES.find((t) => t.name === 'coffee') || THEMES[0];
    const accent = themeDef?.colors?.[1] || '#4b6bfb';

    // simple contrast helper: return black or white depending on background luminance
    const hexToRgb = (hex) => {
        const cleaned = hex.replace('#', '');
        const bigint = parseInt(cleaned, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    };

    const getContrastColor = (hex) => {
        try {
            const { r, g, b } = hexToRgb(hex);
            // relative luminance
            const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            return luminance > 0.55 ? '#000000' : '#ffffff';
        } catch (e) {
            return '#ffffff';
        }
    };

    const activeTextColor = getContrastColor(accent);

    // determine if theme base is light so we can pick card background colors
    const isBaseLight = getContrastColor(themeDef?.colors?.[0] || '#ffffff') === '#000000';
    const cardBg = isBaseLight ? '#ffffff' : '#0f172a'; // light card on light theme, dark card on dark theme
    const cardHoverBg = isBaseLight ? '#f8fafc' : '#111827';

    const { data: friendsList = [], isLoading: loadingFriends } = useQuery({
        queryKey: ['friends'],
        queryFn: getUserFriends,
        select: (data) => data.friends || [],
    });

    const { data: pendingRequests = [], isLoading: loadingPendingFriends } = useQuery({
        queryKey: ['pendingFriends'],
        queryFn: getOutgoingFriendReqs,
        select: (data) => data?.outgoingFriendReqs || [],
    });


    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full max-h-screen overflow-hidden">
            <div className="container mx-auto space-y-10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                    Friends List
                </h2>
            </div>
            <div className="flex space-x-4 mb-4 border-b border-gray-300 pb-2">
                <button
                    className={`px-4 py-2 rounded`}
                    onClick={() => setActiveTab('friends')}
                    style={
                        activeTab === 'friends'
                            ? { backgroundColor: accent, color: activeTextColor }
                            : { backgroundColor: '#e5e7eb', color: '#374151' }
                    }
                >
                    Friends
                </button>
                <button
                    className={`px-4 py-2 rounded`}
                    onClick={() => setActiveTab('pending')}
                    style={
                        activeTab === 'pending'
                            ? { backgroundColor: accent, color: activeTextColor }
                            : { backgroundColor: '#e5e7eb', color: '#374151' }
                    }
                >
                    Pending Requests
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 flex-1 overflow-auto">
                {activeTab === 'friends' ? (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold tracking-tight mb-4">Your Friends</h2>
                        {friendsList.map((friend) => (
                            <div
                                key={friend._id}
                                className="flex items-center justify-between p-4 rounded-lg transition-colors"
                                style={{ backgroundColor: cardBg }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                                        style={{
                                            background: `linear-gradient(135deg, ${accent}, ${themeDef?.colors?.[2] || '#8b5cf6'})`,
                                        }}
                                    >
                                        {/* {friend.profilePic || friend.fullName.split(' ').map(n => n[0]).join('').toUpperCase()} */}
                                        <img src={friend.profilePic} alt={`friends profilePic`} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium tracking-tight">{friend.fullName}</h3>
                                        {/* <div className="flex items-center gap-2">
                                            <span
                                                className={`w-2 h-2 rounded-full`}
                                                style={{
                                                    backgroundColor: friend.status === 'online' ? (themeDef?.colors?.[2] || '#10b981') : '#9ca3af',
                                                }}
                                            ></span>
                                            <span className="text-sm text-gray-600 capitalize">{friend.status}</span>
                                        </div> */}
                                    </div>
                                </div>
                                <button
                                    className="px-4 py-2 text-sm rounded-lg transition-colors"
                                    style={{
                                        color: themeDef?.colors?.[1],
                                        border: `1px solid ${themeDef?.colors?.[1]}`,
                                        background: 'transparent',
                                    }}
                                >
                                    View Profile
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold tracking-tight mb-4">Pending Friend Requests</h2>
                        {pendingRequests.map((request) => (
                            <div
                                key={request._id}
                                className="flex items-center justify-between p-4 rounded-lg transition-colors"
                                style={{ backgroundColor: cardBg }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                                        style={{
                                            background: `linear-gradient(135deg, ${accent}, ${themeDef?.colors?.[2] || '#e779c1'})`,
                                        }}
                                    >
                                        <img src={request.recipient.profilePic} alt="pending request profile"/>
                                    </div>
                                    <div>
                                        <h3 className="font-medium tracking-tight">{request.recipient.fullName}</h3>
                                        <span className="text-sm text-gray-600">{moment(request.updatedAt).fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Friends;