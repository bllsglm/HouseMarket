import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db, firebaseAuth } from "../firebase/BaseConfig"
import Spinner from "../components/Spinner"
import shareIcon from "../assets/svg/shareIcon.svg"
import { toast } from "react-toastify"

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

if(loading){
  return  <Spinner/>
}

  return (
    <main className="container mx-auto">
      {/* SLIDER */}
      <div className="shareIcondiv" onClick={() => {
        navigator.clipboard.writeText(window.location.href)
         setShareLinkCopied(true)
         setTimeout(() => {
          setShareLinkCopied(false)
         }, 2000);
      }}>
        <img src={shareIcon} alt="shareIcon" />
      </div>
      {shareLinkCopied && <p>Link Copied!</p>}
      <div className="listingDetails">
        <p className="listingName">{listing.name} - {listing.offer ? Number(listing.discountedPrice).toLocaleString('en-US') : Number(listing.regularPrice).toLocaleString('en-US')}
        </p>
        <p className="listingLocation">{listing.useLocation} </p>
        <p className="listingType">{listing.type === 'rent' ? 'Rent' : 'Sale'} </p>
        {listing.offer && (<p>You're saving ${listing.regularPrice - listing.discountedPrice }</p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 bedroom'}
          </li>
          <li>{ listing.parking && 'Parking Spot'  }</li>
          <li>{ listing.furnished && 'Furnished' }</li>
        </ul>
        <p className="listingLocationtitle">Location</p>
        {/* MAP */}

        { firebaseAuth.currentUser?.uid !== listing.userRef && (
          <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`}>Contact Landlord
          </Link>
        )}
      </div>
    </main>
  )
}

export default Listing