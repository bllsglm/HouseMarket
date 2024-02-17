import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db, firebaseAuth } from "../firebase/BaseConfig"
import Spinner from "../components/Spinner"
import shareIcon from "../assets/svg/shareIcon.svg"

useState
useEffect
useNavigate
Link
getDoc
doc
firebaseAuth
db
Spinner
shareIcon



const Listing = () => {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()

  useEffect(()=> {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings' , params.listingId)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()){
        console.log(docSnap.data());
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()
  }, [params.listingId])



  return (
    <div>
      {params.categoryName} listings
    </div>
  )
}

export default Listing