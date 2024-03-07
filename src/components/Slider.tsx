import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/BaseConfig'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import { useEffect, useState } from 'react'
import Spinner from './Spinner'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

type dataProp = {
  id: string
  type: string
  name: string
  price: string
  image: string[]
}

const Slider = () => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<dataProp[] | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Get a reference
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(10))

        // Execute query
        const querySnap = await getDocs(q)

        const imagesList = []
        const data: dataProp[] = []
        querySnap.forEach((doc) => {
          data.push({
            id: doc.id,
            type: doc.data().type,
            name: doc.data().name,
            price: doc.data().discountedPrice ?? doc.data().regularPrice,
            image:
              doc.data().imageUrls[
                Math.floor(Math.random() * doc.data().imageUrls.length)
              ],
          })

          imagesList.push(...doc.data().imageUrls)
        })

        setListings(data)

        setLoading(false)
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error((error as any)?.data?.message || (error as any).message)
      }
    }

    fetchImages()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listings?.length === 0) {
    return <></>
  }

  return (
    <Swiper
      className="container lg:h-96 h-96 mb-8 "
      spaceBetween={50}
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {listings?.map((dataPoint, index) => (
        <SwiperSlide key={index}>
          <Link to={`/category/${dataPoint.type}/${dataPoint.id}`}>
            <div
              className="w-full h-full relative"
              style={{
                background: `url(${dataPoint.image}) center no-repeat`,
                backgroundSize: 'cover',
              }}
            >
              <div className=" text-4xl bg-white  absolute right-8 top-8 px-8 max-w-max text-green-600 bg-opacity-60 font-extrabold font  rounded-lg">
                ${Number(dataPoint.price).toLocaleString()}
              </div>
              <div className="absolute text-2xl bottom-1/4 left-4 bg-gray-100 bg-opacity-70 px-8 rounded-lg">
                {dataPoint.name}
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Slider
