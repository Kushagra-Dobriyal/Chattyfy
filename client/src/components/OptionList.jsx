import React from 'react'
import { Copy, Trash2 } from 'lucide-react'
import { useMessageStore } from '../store/useMessageStore'
import { useAuthStore } from '../store/useAuthStore'
import toast from 'react-hot-toast'

const OptionList = ({ message }) => {
    const { authUser } = useAuthStore();
    const { updateMessage } = useMessageStore();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.text);
            toast.success("Message copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy message");
        }
    }

    const handleDelete = async () => {
        try {
            const timeDiff = Math.abs(new Date() - new Date(message.createdAt));
            const fiveMinutes = 5 * 60 * 1000;

            if (timeDiff > fiveMinutes) {
                // For messages older than 5 minutes
                if (message.senderId === authUser._id) {
                    // If user is sender, delete for both
                    await updateMessage(message._id, { 
                        deleteForSender: true,
                        deleteForReciever: true 
                    });
                }
            } else {
                // For messages within 5 minutes
                if (message.senderId === authUser._id) {
                    // If user is sender, delete for sender only
                    await updateMessage(message._id, { deleteForSender: true });
                } else {
                    // If user is receiver, delete for receiver only
                    await updateMessage(message._id, { deleteForReciever: true });
                }
            }
            toast.success("Message deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete message");
        }
    }

    return (
        <div className='flex flex-row gap-1 bg-base-100/50 backdrop-blur-sm px-1 py-0.5 rounded-md shadow-sm'>
            <button 
                className='btn btn-xs btn-ghost hover:bg-base-200 rounded-full p-1'
                onClick={handleCopy}
            >
                <Copy size={14} />
            </button>
            <button 
                className='btn btn-xs btn-ghost hover:bg-base-200 rounded-full p-1'
                onClick={handleDelete}
            >
                <Trash2 size={14} />
            </button>
        </div>
    )
}

export default OptionList