/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { firebaseAuth } from '../firebase/BaseConfig'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase/BaseConfig'
import { User, updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import HomeIcon from '../assets/svg/homeIcon.svg'
import MyListings from '../components/MyListings'

const Profile = () => {
  const [changeDetails, setChangeDetails] = useState(false)
  const [formdata, setFormData] = useState({
    name: firebaseAuth.currentUser?.displayName,
    email: firebaseAuth.currentUser?.email,
  })

  const { name, email } = formdata

  const navigate = useNavigate()

  const logout = async () => {
    await firebaseAuth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (firebaseAuth.currentUser?.displayName !== name) {
        // Update displayName in fb
        await updateProfile(firebaseAuth.currentUser as User, {
          displayName: name,
        })

        // Update in firestore
        if (firebaseAuth.currentUser === null) return

        const userRef = doc(db, 'users', firebaseAuth.currentUser?.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      toast.error((error as any).data?.message | (error as any).message)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  return (
    <div className="container mx-auto bg-gray-200 min-h-screen">
      <header className="w-full rounded p-4  flex container mx-auto  items-center  bg-gray-800">
        <p className="flex-1 text-3xl font-extrabold text-white">My Profile</p>
        <button
          className="bg-black outline-none rounded-full text-white p-3 shadow-lg hover:scale-95 hover:bg-opacity-50 border border-white font-extrabold"
          type="button"
          onClick={logout}
        >
          Sign Out
        </button>
      </header>

      <main>
        <div className="py-2 flex flex-col justify-center items-center gap-4">
          <h2 className="text-2xl font-extrabold text-black max-w-max rounded-3xl">
            Personal Details
          </h2>
          <p
            className="font-bold text-green-700 bg-gray-100 rounded-3xl p-4 cursor-pointer border-green-500 border-2 hover:bg-green-100 "
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}
          >
            {changeDetails ? 'Done' : 'Change'}
          </p>
        </div>

        <div className="flex  justify-center items-center font-extrabold p-8 text-center gap-4 ">
          <form className="flex gap-4 sm:flex-row flex-col ">
            <input
              type="text"
              id="name"
              className="p-4 mr-2 rounded-2xl border border-black"
              disabled={!changeDetails}
              value={String(name)}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className="p-4 rounded-2xl  border border-black"
              disabled={!changeDetails}
              value={String(email)}
              onChange={onChange}
            />
          </form>
        </div>

        <Link
          to="/create-listing"
          className="flex justify-center items-center gap-8 shadow mx-auto max-w-max p-4 rounded-lg bg-gray-200 hover:bg-green-100 border-2 border-green-500"
        >
          <img src={HomeIcon} alt="home" />
          <p className="font-extrabold">Sell or rent your home</p>
          <img src={ArrowRightIcon} alt="arrow-right" />
        </Link>
      </main>
      {/* LISTINGS */}
      <div className="mb-8 pb-8 flex flex-col justify-center items-center">
        <MyListings />
      </div>
    </div>
  )
}

export default Profile
