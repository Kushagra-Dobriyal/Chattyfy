import React, { useEffect, useRef } from 'react'
import { useMessageStore } from '../store/useMessageStore'
import ChatHeader from "./ChatHeader.jsx"
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import avatar from '../assets/avatar.png'
import { formatMessageTime } from "../lib/util.js"

function ChatContainer() {
  const { getMessages, messages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribesFromMessages } = useMessageStore()
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle messages and socket subscription
  useEffect(() => {
    if (!selectedUser?._id) return;
    
    const fetchMessages = async () => {
      await getMessages(selectedUser._id);
    };

    fetchMessages();
    subscribeToMessages();

    return () => {
      unsubscribesFromMessages();
    }
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribesFromMessages])

  if (!selectedUser) return null;

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col'>
        <ChatHeader />
        <div className='flex-1 overflow-y-auto'>
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 space-y-4'>
          {messages.map((message) => (
            <div key={message._id}
              className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
            >
              <div className='chat-image avatar'>
                <div className='size-10 rounded-full border'>
                  <img
                    src={message.senderId === authUser._id ? authUser.profilePic || avatar : selectedUser.profilePic || avatar}
                    alt='Profile-Pic'
                  />
                </div>
              </div>
              <div className='chat-header mb-1'>
                <time className='text-xs opacity-50 ml-1'>
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className='chat-bubble flex flex-col'>
                {message.image && (
                  <img
                    src={message.image}
                    alt='Attachment'
                    className='sm:max-w-[200px] rounded-md mb-2'
                  />
                )}
                {message.text && <p className='p-1'>{message.text}</p>}
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatContainer