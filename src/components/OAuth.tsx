import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { db, firebaseAuth } from '../firebase/BaseConfig'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import googleIcon from '../assets/svg/googleIcon.svg'

const OAuth = () => {
  const navigate = useNavigate()

  const handleClick = async () => {
    try {
      // Sign in using a popup.
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(firebaseAuth, provider)

      // The signed-in user info.
      const user = result.user

      // Check for User and if there is any user with the same uid or not
      const docRef = doc(db, 'users', user.uid)
      const docSnap = getDoc(docRef)

      if (!(await docSnap).exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }

      navigate('/')
    } catch (error) {
      toast.error(
        'Invalid Credentials' ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.data?.message ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).message
      )
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-gray-200 rounded-full p-2 m-2 hover:scale-150 ease-in-out transition-transform duration-1000 mt-4"
      >
        <img src={googleIcon} className="h-8 w-8" />
      </button>
    </>
  )
}

export default OAuth
