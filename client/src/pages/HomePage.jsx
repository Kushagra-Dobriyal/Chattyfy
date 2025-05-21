import React from 'react'
import { useMessageStore } from '../store/useMessageStore'

import Sidebar from '../components/Sidebar.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import NoChatSelected from '../components/NoChatSelected.jsx';

function HomePage() {

  const { messages, users, getUsers, getMessages, selectedUser } = useMessageStore();

  return (
    <div className='h-full bg-base-200'>
      <div className='flex justify-center items-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar/>

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}

          </div>
        </div>
      </div>
    </div> 
  )
}

export default HomePage