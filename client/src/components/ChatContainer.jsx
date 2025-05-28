import React, { useEffect, useRef } from 'react'
import { useMessageStore } from '../store/useMessageStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import avatar from '../assets/avatar.png'


import { formatMessageTime } from "../lib/util.js"

function ChatContainer() {
  const { getMessages, messages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useMessageStore()
  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behaviour: "smooth" })
  }, [messages])

  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToMessages()
    return () => subscribeToMessages()

  }, [selectedUser?._id, getMessages])





  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col h-screen'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4'>
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {messages.map((message) => (
            <div key={message._id}
              className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
              ref={messageEndRef}
            >
              <div className='chat-image avatar'>
                <div className='size-10 rounded-full border'>
                  <img
                    src={`message.senderId===authUser._id` ? authUser.profilePic || avatar : selectedUser.profilePic || avatar}
                    alt='Profile-Pic'
                  />
                </div>
              </div>
              <div className='chat-header mb-1'>
                <time className='tex-xm opacity-50 ml-1'>
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className='chat-bubble flex flex-col'>
                {message.image && (
                  <img
                    src={message.image}
                    alt='Attachment'
                    className='sm:max-w-[200px] rounded-md mb-2 '
                  />
                )}
                {/* render if any picture is there */}
                {message.text && <p className='p-1'>{message.text}</p>}
                {/* render if any message is there */}
              </div>

            </div>
          ))}
        </div>
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatContainer