import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import HomePage from './Pages/HomePage'
import SignupPage from './Pages/SignupPage'
import LoginPage from './Pages/LoginPage'
import ProfilePage from './Pages/ProfilePage'
import SettingsPage from './Pages/SettingsPage'
import { useAuthStore } from './Store/useAuthStore.js'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import {Toaster} from 'react-hot-toast'


function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])


  console.log(authUser)
  if(isCheckingAuth && !authUser){
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }
  

  return (
    <>
    <Navbar />

    <Routes>
      <Route path='/' element={authUser? <HomePage />: <Navigate to={'/login'}/>} />
      <Route path='/signup' element={authUser?<Navigate to={'/'} />:<SignupPage />} />
      <Route path='/login' element={authUser?<Navigate to={'/'} />:<LoginPage />} />
      <Route path='/settings' element={<SettingsPage />} />
      <Route path='/profile' element={authUser?<ProfilePage />:<Navigate to={'/login'}/>} />
    </Routes>
    <Toaster />
    </>
  )
}

export default App
