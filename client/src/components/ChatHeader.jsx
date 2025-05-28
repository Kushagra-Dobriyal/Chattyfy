import React from 'react'
import { useMessageStore } from '../store/useMessageStore.js'
import { useAuthStore } from "../store/useAuthStore.js";
import avatar from '../assets/avatar.png'
import { X } from 'lucide-react'

function ChatHeader() {
    const { selectedUser, setSelectedUser, isTyping } = useMessageStore();
    const { onlineUsers } = useAuthStore()

    return (
        <div className='w-full border-b border-base-300'>
            <div className='w-full py-3 px-4 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <img
                        src={selectedUser.profilePic || avatar}
                        alt='Profile-Pic'
                        className="size-11 object-cover rounded-full"
                    />

                    <div className='flex flex-col'>
                        <h1 className='text-lg font-semibold'>
                            {selectedUser.fullName}
                        </h1>
                        <p className='text-sm text-zinc-400'>
                            {isTyping ? "Typing.." : selectedUser && onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setSelectedUser(null)}
                    className='p-2 hover:bg-base-300 rounded-full transition-colors'
                >
                    <X className='size-5' />
                </button>
            </div>
        </div>
    )
}

export default ChatHeader