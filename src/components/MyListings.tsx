import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db, firebaseAuth } from "../firebase/BaseConfig"
import { Link } from "react-router-dom"


const MyListings = () => {

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

      console.log(myAllListings);
      setMyListings(myAllListings)
    }

    fetchMyListings()
  }, [])



  return (
    <div>
      <h2>My Listings</h2>
      { mylistings?.map((mylisting, index) => (
        <Link to={`/category/${mylisting.data.type}/${mylisting.id}`} key={index}>
          <div className="flex shadow-2xl gap-4 bg-slate-100 m-4 p-4 rounded-2xl hover:bg-green-100 cursor-pointer"> 
            <img 
              src={mylisting.data.imageUrls[0]} 
              alt="image" 
              className="w-32 h-32 rounded-2xl"
              />
              <div className="flex flex-col gap-2">
                 <p>{mylisting.data.name}</p>  
                 <p> ${Number(mylisting.data.offer ? mylisting.data.discountedPrice : mylisting.data.regularPrice).toLocaleString()}</p>
                 <p>{mylisting.data.location}</p>
                 <p>For {mylisting.data.type}</p>
                 <p>Listing Date : {mylisting.time}</p>
              </div>
          </div>
         </Link>
      ))}
     
    </div>
  )
}

export default MyListings