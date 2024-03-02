import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db, firebaseAuth } from "../firebase/BaseConfig"
import { Link, useNavigate } from "react-router-dom"
import Spinner from "./Spinner"
import deleteIcon from '../assets/svg/deleteIcon.svg'
import editIcon from '../assets/svg/editIcon.svg'



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
    <>
      <h2 className="m-4 p-4 font-extrabold text-2xl text-opacity-50 border-b-2 border-gray-950">My Listings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-w-[280px]">
        {( mylistings.length === 0 ) ? <h1 className="text-white text-center text-2xl font-extrabold bg-rose-500 rounded-lg m-4 p-4 shadow-lg shadow-slate-800">You don't have any listings</h1> : 
          <>
          { mylistings?.map((mylisting, index) => (
            <Link to={`/category/${mylisting.data.type}/${mylisting.id}`} key={index}>
              <div className="flex flex-col sm:flex-row  shadow-2xl gap-4 bg-slate-100 m-2 p-4 rounded-2xl hover:bg-green-100 cursor-pointer"> 
                <img 
                  src={mylisting.data.imageUrls[0]} 
                  alt="image" 
                  className="w-32 h-32 rounded-2xl"
                  />
                <div className="flex flex-1 flex-col gap-2 ">
                  <p className=" font-extrabold">{mylisting.data.name}</p>  
                  <hr />
                  <p className="text-green-500 font-extrabold"> ${Number(mylisting.data.offer ? mylisting.data.discountedPrice : mylisting.data.regularPrice).toLocaleString()}</p>
                  <p>{mylisting.data.location}</p>
                  <p>For {mylisting.data.type}</p>
                  <p>Listing Date : {mylisting.time}</p>
                  <hr />
                  <div className="flex">
                    <div className="del-button">
                      <img 
                      onClick={async() => {
                      if(window.confirm('Are you sure you want to delete?')){
                        await deleteDoc(doc(db, "listings", `${mylisting.id}`))
                      navigate('/profile')
                        }
                      } }
                      
                      src={deleteIcon} alt="Delete Icon" 
                      className="bg-gray-100 border-red-600 border rounded-lg shadow-lg hover:scale-110 transition-transform"
                      />
                    </div>
                    <Link to={`/edit-listing/${mylisting.id}`} className="edit-button">
                      <img 
                      src={editIcon} alt="Edit Icon" 
                      className="bg-gray-100 border-black border rounded-lg shadow-lg hover:scale-110 transition-transform ml-4"
                      />
                    </Link>
                 </div>
                </div>
              </div>
            </Link>
          ))}
          </>
        }
      </div>
   </>
  )
}

export default MyListings