import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { updateUserData } from "../lib/api";


const useUpdateUserData = () => {
    const queryClient = useQueryClient();
    const { mutate: updateProfile, isPending, error } = useMutation({
        mutationFn: updateUserData,
        onSuccess: () => {
            toast.success('Profile updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
        }
    });

    return { error, isPending, updateProfile };
}

export default useUpdateUserData