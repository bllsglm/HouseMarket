import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { updateProfile, createUserWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth, db } from '../firebase/BaseConfig.ts'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth.tsx'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const { name, email, password } = formData

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      )
      const user = userCredential.user
      console.log(user)
      updateProfile(firebaseAuth.currentUser!, {
        displayName: name,
      })

      interface FormDataWithTimestamp {
        name: string
        email: string
        password?: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timestamp?: any // Change 'any' to the appropriate type if possible
      }

      const formDatacopy: FormDataWithTimestamp = { ...formData }
      delete formDatacopy.password
      formDatacopy.timestamp = serverTimestamp()
      await setDoc(doc(db, 'users', user.uid), formDatacopy)
      navigate('/')
      toast.success('Registered Successfully')
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((err as any)?.data?.message || (err as any).message)
    }
  }

  return (
    <>
      <div className="container min-h-screen mx-auto flex flex-col justify-center items-center ">
        <header>
          <p className="text-2xl mb-1 font-extrabold">Welcome!</p>
        </header>
        <main className="shadow-2xl border border-black m-4">
          <form
            className="flex flex-col rounded p-8 mb-4 gap-4"
            onSubmit={submitHandler}
          >
            <input
              className="border-b-2 outline-none h-10 rounded-lg p-4"
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={name}
              onChange={handleChange}
            />
            <input
              className="border-b-2 outline-none h-10 rounded-lg p-4"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
            <div className="relative">
              <input
                className="border-b-2 outline-none h-10 rounded-lg p-4"
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
              <img
                src={visibilityIcon}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-0 mt-3 mr-3 cursor-pointer"
              />
            </div>

            <div className="relative">
              <button
                type="submit"
                className="my-2 w-full text-white bg-blue-500 p-1 rounded-full hover:bg-opacity-80"
              >
                Sign Up{' '}
              </button>
              <img
                src={arrowRightIcon}
                className="absolute right-0 top-0 w-8 h-12 cursor-pointer"
              />
            </div>
            <p className="text-sm mt-4">
              Already have an account?{' '}
              <Link className="text-blue-500" to="/signIn">
                {' '}
                Sign In{' '}
              </Link>
            </p>
          </form>
          <div className="flex flex-col justify-center items-center mb-2">
            <p className="mb-1 text-gray-500">Sign Up with</p>
            <OAuth />
          </div>
        </main>
      </div>
    </>
  )
}

export default SignUp
