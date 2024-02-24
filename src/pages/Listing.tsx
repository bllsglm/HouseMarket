import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db, firebaseAuth } from "../firebase/BaseConfig"
import Spinner from "../components/Spinner"
import shareIcon from "../assets/svg/shareIcon.svg"
import { toast } from "react-toastify"
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'



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
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()

   }, [params.listingId, navigate]
  )

if(loading){
  return  <Spinner/>
}

  return (
    <>
    <main className="m-8 shadow-2xl p-4 w-fit">
      {/* SLIDER */}

      <div className="flex flex-col">

        <div className="bg-green-500 p-2 rounded-full w-10 h-auto border border-black cursor-pointer hover:bg-opacity-50" 
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => {
            setShareLinkCopied(false)
          }, 2000);
        }}>
          <img src={shareIcon} alt="shareIcon" />
        </div>

        {shareLinkCopied && <p className="text-green-600">Link Copied!</p>}
        <p className="mt-4 font-extrabold text-lg">
          {listing.name} - {listing.offer ? Number(listing.discountedPrice).toLocaleString('en-US') : Number(listing.regularPrice).toLocaleString('en-US')}
        </p>
        <p>{listing.useLocation}  </p>
        <p>{listing.type === 'rent' ? 'Rent' : 'Sale'} </p>
        {listing.offer && (<p>You're saving ${(listing.regularPrice - listing.discountedPrice).toLocaleString() }</p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 bedroom'}
          </li>
          <li>{ listing.parking && 'Parking Spot'  }</li>
          <li>{ listing.furnished && 'Furnished' }</li>
        </ul>
        <p className="mb-4">Location</p>
        {/* MAP */}

        { firebaseAuth.currentUser?.uid !== listing.userRef && (
          <Link 
          className="max-w-xs md:max-w-md bg-green-300 font-extrabold bg-opacity-50 rounded-3xl border-2 border-black text-black  py-4 px-10 hover:bg-opacity-100"
          to={`/contact/${listing.userRef}?listingName=${listing.name}`}>
            Contact Landlord
          </Link>
        )}
      </div>
    </main>

    <div id="map">
      <MapContainer center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={true} className="h-96 w-4/5 m-8 mb-24 p-24 ">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
        <Popup>
          {listing.location} <br />
        </Popup>
      </Marker>
      </MapContainer>
    </div>
  </>
  )
}

export default Listing