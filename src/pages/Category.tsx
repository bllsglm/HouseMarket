/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DocumentData,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase/BaseConfig'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem, { ListingProp } from '../components/ListingItem'
import { ListingsProps } from './Offers'

startAfter

const Category = () => {
  const [listings, setListings] = useState<ListingsProps[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchListing] =
    useState<DocumentData | null>(null)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
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
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchListing(lastVisible)

        const listings: ListingsProps[] = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error((error as any).data?.message || (error as any).message)
      }
    }

    fetchListings()
  }, [params.categoryName])

  // PAGINATION / LOAD MORE
  const onFetchMoreListings = async () => {
    try {
      // Get a reference
      const listingsRef = collection(db, 'listings')

      // Create a query
      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      )

      // Execute query
      const querySnap = await getDocs(q)
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchListing(lastVisible)

      const listings: { id: string; data: DocumentData }[] = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings((prevState) => [
        ...listings,
        ...(prevState as ListingsProps[]),
      ])
      setLoading(false)
    } catch (error) {
      toast.error('There are no more listings to display')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <header>
        <p className="mb-4 font-extrabold capitalize text-4xl">
          {params.categoryName === 'rent'
            ? 'Places for rent'
            : 'Places for sale'}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul>
              {listings.map((listing) => (
                <h3 key={listing.id}>
                  <ListingItem
                    listing={listing.data as ListingProp}
                    id={listing.id}
                    key={listing.id}
                  />
                </h3>
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p> No listings for {params.categoryName}</p>
      )}
      <div className="flex justify-center items-center mb-12">
        <button
          className=" bg-gray-700 p-4 m-4  border-2 border-black rounded-full text-white hover:bg-opacity-75 font-extrabold shadow-2xl"
          onClick={onFetchMoreListings}
        >
          Load More...
        </button>
      </div>
    </div>
  )
}

export default Category
