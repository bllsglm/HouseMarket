import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase/BaseConfig"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import ListingItem from '../components/ListingItem';



const Offer = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchListings = async() => {
      try {
        // Get a reference 
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
          listingsRef, 
          where('offer', '==', true), 
          orderBy('timestamp', 'desc'), 
          limit(10)
        )
          
        // Execute query
        const querySnap = await getDocs(q)
        const listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setListings(listings)
        setLoading(false)

      } catch (error) {
        toast.error(error!.data?.message || error.message)
      }
    }

    fetchListings()
  }, [])

  
 
  
  return (
    <div className="container mx-auto max-w-max ">
      <header>
        <p className="font-extrabold capitalize text-2xl p-4">
          Offers
        </p>
      </header>
      {loading ? <Spinner/> : listings && listings.length > 0 ?(
      <>
        <main>
          <ul>
            {listings.map((listing) => (
              <h3 key={listing.id}>
                <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
              </h3>
            ))}
          </ul>
        </main>
      </> 
      ) : (
      <p> There are no current offers</p>
    )}
    </div>
  )
}

export default Offer