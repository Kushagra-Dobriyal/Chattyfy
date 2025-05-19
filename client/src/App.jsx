import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast"

import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-11 animate-spin'/>
    </div>
  )

  return (
    <div  data-theme="cyberpunk">
      <Navbar />
      <Routes>
        <Route path="/" element={authUser?._id ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser?._id ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser?._id ? <LoginPage /> : <Navigate to="/login" />} />
        <Route path='/settings' element={authUser?._id ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path='/profile' element={authUser?._id ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App