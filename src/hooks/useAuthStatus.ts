import { useEffect, useRef, useState } from "react"
import { firebaseAuth } from "../firebase/BaseConfig"
import { onAuthStateChanged } from "firebase/auth"

const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const isMounted = useRef(true)

  useEffect(()=> {
    if(isMounted){
      onAuthStateChanged(firebaseAuth, (user) => {
      if(user){
        setLoggedIn(true)
      } 
      
      setCheckingStatus(false)
    })
    }

    return () => {
      isMounted.current = false
    }

  },[isMounted])


  return { loggedIn, checkingStatus}
}

export default useAuthStatus