import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Loader } from "lucide-react";


import HomePage from './Pages/HomePage';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import SettingsPage from './Pages/SettingsPage';
import ProfilePage from './Pages/ProfilePage';






function App() {

  // const Navigate=NavLink();

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore(); //this is how we can use /axcess the global states

  useEffect(() => {
    checkAuth(); // making sure every time the webpage is reloaded then thsi function will run ....
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className=' size-11 animate-spin' />
    </div>
  )

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser._id ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser? <SignUpPage />:<Navigate to="/"/>} />
        <Route path='/login' element={!authUser?<LoginPage />:<Navigate to="/"/>} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser._id ?<ProfilePage/> : <Navigate to="/login" />} />

      </Routes>
    </div>
  )
}

export default App