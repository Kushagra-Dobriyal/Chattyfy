import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast"

import HomePage from './Pages/HomePage';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import SettingsPage from './Pages/SettingsPage';
import ProfilePage from './Pages/ProfilePage';

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
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser?._id ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser?._id ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser?._id ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={authUser?._id ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path='/profile' element={authUser?._id ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App