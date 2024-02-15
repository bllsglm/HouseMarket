import { useState } from 'react'
import ArrowRightIcon from '../assets/icons/KeyboardArrowRightIcon.tsx'
import VisibilityIcon from '../assets/icons/VisibilityIcon.tsx'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../firebase/BaseConfig.ts'
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth.tsx'



const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({email:'', password:''})
  const { email, password } = formData

  const navigate = useNavigate()

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const submitHandler = async(e : React.FormEvent) => {
    e.preventDefault()
   try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    
    if(userCredential.user){
      
      navigate('/profile')
      toast.success(`Welcome ${userCredential.user.displayName}`)
    }
  } catch (err) {
    toast.error(err?.data?.message || err.message)
   }
  }

  return (
    <>
     
      <div className='container h-screen mx-auto flex flex-col justify-center items-center'>
        <header>
          <p className='sm:text-lg lg:text-xl mb-1'>Welcome Back!</p>
        </header>
        <main className='shadow-lg'>
          <form className="flex flex-col rounded p-8 mb-4" onSubmit={submitHandler}>
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
               <button type="submit" className='my-2 w-full text-white bg-blue-500 p-1 rounded-full'>Sign In </button>
               <ArrowRightIcon className='absolute right-0 top-0 w-8 h-12 cursor-pointer' fill='#fff'/>
            </div>
           
            <Link to='/forgotpassword' className=' right-0 top-12 text-green-800 text-sm'>Forgot Password</Link>
            <p className='text-sm mt-4'>Don't have an account? <Link className='text-blue-500' to='/signUp'> Sign Up </Link></p>
          </form>
          
          <div className='flex flex-col justify-center items-center mb-2'>
             <p className='mb-1 text-gray-500'>Sign In with</p>
             <OAuth/>
          </div>
         
        </main>
        
      </div>
      
    </>
  )
}

export default SignIn