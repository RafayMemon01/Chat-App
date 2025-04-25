import { useState } from 'react'
import React, { useState } from 'react'
import { useAuthStore } from '../Store/useAuthStore';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formDate, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: ''
  })
  const {signUp, isSigningUp} = useAuthStore()

  const validateForm = () =>{

  }
  const handleForm = (e)=>{
e.preventDefault()
  }
  return (
    <div>SignupPage</div>
  )
}

export default SignupPage