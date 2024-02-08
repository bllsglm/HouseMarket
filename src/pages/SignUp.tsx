import { useState } from 'react'
import ArrowRightIcon from '../assets/icons/KeyboardArrowRightIcon.tsx'
import VisibilityIcon from '../assets/icons/VisibilityIcon.tsx'
import { Link } from 'react-router-dom'



const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({name:'',email:'', password:'', confirmPassword:''})
  const {name ,email, password, confirmPassword } = formData

  const handleChange = (e:React.ChangeEvent) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  return (
    <>
     
      <div className='container min-h-screen mx-auto flex flex-col justify-center items-center'>
        <header>
          <p className='text-sm sm:text-lg lg:text-xl mb-1'>Welcome Back!</p>
        </header>
        <main className='shadow-lg'>
          <form className="flex flex-col rounded p-8 mb-4">
          <input 
              className='border-b-2 outline-none h-10' 
              type="name" 
              name="name" 
              id="name" 
              placeholder="Name"
              value={name}
              onChange={handleChange}
            />
            <input 
              className='border-b-2 outline-none h-10' 
              type="email" 
              name="email" 
              id="email" 
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
            <div className='relative'>
              <input 
              className='border-b-2 outline-none h-10' 
              type={showPassword ? 'text' : 'password'}
              name="password" 
              id="password" 
              placeholder="Password"
              value={password}
              onChange={handleChange}
              />
              <VisibilityIcon 
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-0 top-0 mt-3 mr-3 cursor-pointer'
              />
            </div>

            <div className='relative'>
              <input 
              className='border-b-2 outline-none h-10' 
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword" 
              id="confirmPassword" 
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              />
              <VisibilityIcon 
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-0 top-0 mt-3 mr-3 cursor-pointer'
              />
            </div>

            <div className='relative'>
               <button type="submit" className='my-2 w-full text-white bg-blue-500 p-1 rounded-full'>Sign Up </button>
               <ArrowRightIcon className='absolute right-0 top-0 w-8 h-12 cursor-pointer' fill='#fff'/>
            </div>
            <p className='text-sm mt-4'>Already have an account? <Link className='text-blue-500' to='/signIn'> Sign In </Link></p>
          </form>
          {/* Google OAuth */}
        </main>
        
      </div>
      
    </>
  )
}

export default SignUp