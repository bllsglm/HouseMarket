import {useState } from "react"
import { firebaseAuth } from "../firebase/BaseConfig"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase/BaseConfig"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify"

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
        </div>

      </main>
    </div>
  )
  }


export default Profile