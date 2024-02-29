import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db, firebaseAuth } from "../firebase/BaseConfig"
import Spinner from "../components/Spinner"
import shareIcon from "../assets/svg/shareIcon.svg"
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';


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
    <div className="flex flex-col mx-auto container ">

      <main className="m-8 shadow-2xl p-4">
       
        <Swiper
        className="w-full lg:h-96  h-80 mb-8 "
        spaceBetween={50}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        slidesPerView={1}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        { listing.imageUrls.map((url,index) => (
            <SwiperSlide key={index}> 
              <div 
              className="w-full h-full"
              style={{
                background : `url(${listing.imageUrls[index]}) center no-repeat`,
                backgroundSize: 'cover'
              }}
              ></div>
            </SwiperSlide>
        ))}
      </Swiper>

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
            {listing.name} - ${listing.offer ? Number(listing.discountedPrice).toLocaleString('en-US') : Number(listing.regularPrice).toLocaleString('en-US')}
          </p>
          <p>{listing.location}  </p>
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
        
          {/* MAP */}

          { firebaseAuth.currentUser?.uid !== listing.userRef && (
            <Link 
            className="m-4 max-w-xs md:max-w-md bg-green-300 font-extrabold bg-opacity-50 rounded-3xl border-2 border-black text-black  py-4 px-10 hover:bg-opacity-100"
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}>
              Contact Landlord
            </Link>
          )}
        </div>

      </main>

      <div id="map" className="m-8 shadow-2xl p-4 z-0">
        <p className="mb-4">Location</p>
        <MapContainer center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={true} className="h-96 sm:h-80 w-full mx-auto mb-8">
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
  </div>
  )
}

export default Listing