import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db, firebaseAuth } from "../firebase/BaseConfig"
import { Link, useNavigate } from "react-router-dom"
import Spinner from "./Spinner"
import deleteIcon from '../assets/svg/deleteIcon.svg'


const MyListings = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [mylistings, setMyListings] = useState(null)
 
  useEffect(()=> {
    const fetchMyListings = async() => {

      // Get a Reference
      const ListingRef = collection(db,'listings')

      // Make a query
      const q =  query(ListingRef , where('userRef', '==' ,firebaseAuth.currentUser?.uid ), orderBy('timestamp', 'desc'))
      const myListingSnap = await getDocs(q)

      const myAllListings = []
      myListingSnap.forEach((doc) => {
        const time = doc.data().timestamp.toDate().toLocaleDateString()
        return myAllListings.push({id:doc.id, data:doc.data(), time})
      });

      setMyListings(myAllListings)
      setLoading(false)
    }

    fetchMyListings()
  }, [])


  if(loading){
    return <Spinner/>
  }

  return (
    <div className="max-w-max min-w-[280px]">
      {( mylistings.length === 0 ) ? <h1 className="text-white text-center text-2xl font-extrabold bg-rose-500 rounded-lg m-4 p-4 shadow-lg shadow-slate-800">You don't have any listings</h1> : 
        <>
          <h2 className="m-4 p-4 font-extrabold text-2xl text-opacity-50 border-b-2 border-gray-950">My Listings</h2>
        { mylistings?.map((mylisting, index) => (
          <Link to={`/category/${mylisting.data.type}/${mylisting.id}`} key={index}>
            <div className="flex flex-col sm:flex-row  shadow-2xl gap-4 bg-slate-100 m-2 p-4 rounded-2xl hover:bg-green-100 cursor-pointer"> 
              <img 
                src={mylisting.data.imageUrls[0]} 
                alt="image" 
                className="w-32 h-32 rounded-2xl"
                />
              <div className="flex flex-1 flex-col gap-2 ">
                <p className="font-extrabold">{mylisting.data.name}</p>  
                <hr />
                <p> ${Number(mylisting.data.offer ? mylisting.data.discountedPrice : mylisting.data.regularPrice).toLocaleString()}</p>
                <p>{mylisting.data.location}</p>
                <p>For {mylisting.data.type}</p>
                <p>Listing Date : {mylisting.time}</p>
                <hr />
                <img 
                onClick={async() => {
                  if(window.confirm('Are you sure you want to delete')){
                    await deleteDoc(doc(db, "listings", `${mylisting.id}`))
                  navigate('/profile')
                  }
                } }
                style={{fill: 'red', backgroundPosition: 'center', backgroundSize:'cover'}}
                src={deleteIcon} alt="Delete Icon" 
                className="w-6 h-6  bg-gray-100 border-red-600 border rounded-lg shadow-lg hover:scale-110 transition-transform"
                />
              </div>
            </div>
          </Link>
        ))}
        </>
      }
      
    </div>
  )
}

export default MyListings