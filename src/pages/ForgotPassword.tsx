import { useState } from "react"
import { Link } from "react-router-dom"
import { firebaseAuth } from "../firebase/BaseConfig"
import { sendPasswordResetEmail } from "firebase/auth"
import { toast } from "react-toastify"
import ArrowRightIcon from "../assets/icons/KeyboardArrowRightIcon"


ArrowRightIcon
toast
sendPasswordResetEmail
firebaseAuth
Link
useState

const ForgotPassword = () => {
  const [ email, setEmail ] = useState('')

  const onChange = (e) => {
    setEmail(e.target.value)
  }


  const onSubmit = async(e : React.FormEvent) => {
    e.preventDefault()
    try {
      await sendPasswordResetEmail(firebaseAuth,email)
      toast.success('Email was sent')
    } catch (err) {
      toast.error(err?.data?.message || err.message)
    }
  }


  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <header>
        <p className="font-bold text-[30px] m-8 ">Forgot Password</p>
      </header>

      <main className="relative shadow-lg">
        <form onSubmit={onSubmit}>
          <input 
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
            className="block mb-8  outline-none border-b-2 p-2 "
          />
          <Link to='/signIn' className="block absolute right-0 bottom-12 mt-1 font-bold text-green-600">
            Sign In
          </Link>

          <div>
            <div></div>
            <div className='relative'>
               <button type="submit" className='my-2 w-full text-white bg-blue-500 p-1 rounded-full'>Send Reset Link</button>
               <ArrowRightIcon className='absolute right-0 top-0 w-8 h-12 cursor-pointer' fill='#fff'/>
            </div>
           
          </div>

        </form>
      </main>

    </div>
  )
}

export default ForgotPassword