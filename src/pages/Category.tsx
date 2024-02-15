import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../firebase/BaseConfig"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import ListingItem from '../components/ListingItem';



const Category = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async() => {
      try {
        // Get a reference 
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
          listingsRef, 
          where('type', '==', params.categoryName), 
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
  }, [params.categoryName])

  
 
  
  return (
    <div className="container mx-auto mt-4">
      <header>
        <p className="mb-4 font-extrabold capitalize text-2xl">
          {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
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
      <p> No listings for {params.categoryName}</p>
    )}
    </div>
  )
}

export default Category