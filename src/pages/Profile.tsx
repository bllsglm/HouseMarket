import {useState } from "react"
import { firebaseAuth } from "../firebase/BaseConfig"
import { Link, useNavigate } from "react-router-dom"
import { db } from "../firebase/BaseConfig"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg"
import HomeIcon from '../assets/svg/homeIcon.svg';

HomeIcon
ArrowRightIcon

const Profile = () => {
  const [changeDetails, setChangeDetails] = useState(false)
  const [formdata, setFormData] = useState({
    name : firebaseAuth.currentUser?.displayName,
    email : firebaseAuth.currentUser?.email
  })

  const {name, email} = formdata

  const navigate = useNavigate()

  const logout = async() => {
    console.log(firebaseAuth.currentUser);
    await firebaseAuth.signOut()
    navigate('/')
    console.log(firebaseAuth.currentUser);
  }

  const onSubmit = async() => {
    try {
      if(firebaseAuth.currentUser?.displayName !== name) {
        
        // Update displayName in fb
        await updateProfile(firebaseAuth.currentUser, {
          displayName: name
        })

        // Update in firestore
        const userRef = doc(db, 'users', firebaseAuth.currentUser?.uid)
        await updateDoc(userRef, {
          name
        })
      }
    } catch (error) {
      toast.error(error.data?.message | error.message)
    }
  }

  const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target
    setFormData(prevState => ( {
      ...prevState,
       [id] : value
     } ))
  }

  return (
    <div className="container mx-auto">
      <header className="w-full py-2  flex container mx-auto  items-center">
          <p className="flex-1 text-3xl font-extrabold">My Profile</p>
          <button className="bg-black outline-none rounded-full text-white p-3 shadow-lg hover:scale-95 hover:bg-opacity-80" type='button' onClick={logout}>Sign Out</button>
      </header>

      <main>
        <div className="py-2 flex">
          <p className="flex-1">Personal Details</p>
          <p 
            className="font-bold text-green-700"
            onClick={()=> {
              changeDetails && onSubmit()
              setChangeDetails(prevState => !prevState)
            }}
            >{ changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div>
          <form>

            <input 
              type="text" 
              id="name" 
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />

            <input 
              type="text" 
              id="email" 
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />

          </form>
        </div >
            <Link to='/create-listing' className="flex justify-center sm:w-1/2 sm:mx-auto items-center gap-8 shadow w-auto m-2 p-4 rounded-lg bg-gray-200 border  hover:border-green-900 hover:bg-green-100">
              <img src={HomeIcon} alt="home" />
              <p>Sell or rent your home</p>
              <img src={ArrowRightIcon} alt="arrow-right" />
            </Link>
      </main>
    </div>
  )
  }


export default Profile