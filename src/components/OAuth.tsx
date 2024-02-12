import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { GoogleIcon } from "../assets/icons"
import { db, firebaseAuth } from "../firebase/BaseConfig"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"



const OAuth = () => {
  const navigate = useNavigate()

  const handleClick = async () => {

    try {
    // Sign in using a popup.
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);

    // The signed-in user info.
    const user = result.user;

    // Check for User
    const docRef = doc(db, 'users', user.uid)
    const docSnap = getDoc(docRef)

    if(!(await docSnap).exists()){
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        timestamp : serverTimestamp()
      })
    }

    navigate('/')
    } catch (error) {
      toast.error(error?.data?.message || error.message)
    }
  }

  return (
    <>
    <button
    onClick={handleClick}
    className="bg-gray-200 rounded-full p-2 m-2 hover:scale-150 ease-in-out transition-transform duration-1000 mt-4" 
    >
      <GoogleIcon className='h-8 w-8'/>
    </button>
    </>
  )
}

export default OAuth