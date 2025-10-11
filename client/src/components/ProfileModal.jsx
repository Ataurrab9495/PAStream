import { FileText, Loader, MapPin, Save, User, X } from 'lucide-react'
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ProfileModal = ({ isOpen, onClose, userData, onSave, isPending = false }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        location: '',
        profilePic: '',
    });
    const [errors, setErrors] = useState({});

    // inserting data when userData changes
    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData?.fullName || '',
                bio: userData?.bio || '',
                location: userData?.location || '',
            })
        }
    }, [userData]);

    // creating react portal for modal
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);


    const handleClose = () => {
        console.log("closing modal");

        if (onClose) onClose();
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }

    // validate form data
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        if (formData.bio && formData.bio.length > 500) {
            newErrors.bio = 'Bio must be less than 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        if (validateForm()) onSave(formData);
    }

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white relative">
                    {<button
                        onClick={handleClose}
                        /* disabled={isPending} */
                        className="absolute top-4 right-4 btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20 disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>}
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                    <p className="text-sm opacity-90 mt-1">Update your profile information</p>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="space-y-6">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-base-300 border-4 border-base-200 shadow-lg">
                                    {userData?.profilePic ? (
                                        <img
                                            src={userData?.profilePic}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-16 h-16 text-base-content opacity-40" />
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Full Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Full Name *
                                </span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className={`input input-bordered w-full ${errors.fullName ? 'input-error' : ''}`}

                                disabled={isPending}
                            />
                            {errors.fullName && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.fullName}</span>
                                </label>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Bio
                                </span>
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself..."
                                className={`textarea textarea-bordered h-24 resize-none ${errors.bio ? 'textarea-error' : ''}`}
                                disabled={isPending}
                                maxLength={500}
                            />

                            {errors.bio && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.bio}</span>
                                </label>
                            )}
                            {/* Location */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="City, Country"
                                    className="input input-bordered w-full"
                                    disabled={isPending}
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* saving actions */}
                <div className="bg-base-200 p-6 flex justify-end gap-3 border-t border-base-300">
                    <button
                        onClick={handleClose}
                        disabled={isPending}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="btn btn-primary"
                    >
                        {isPending ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

export default ProfileModal;