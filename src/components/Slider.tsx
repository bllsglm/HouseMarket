import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/BaseConfig'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';



const Slider = () => {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  useEffect(() => {
    const fetchImages = async() => {
      try {
        // Get a reference 
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
          listingsRef, 
          orderBy('timestamp', 'desc'), 
          limit(10)
        )
          
        // Execute query
        const querySnap = await getDocs(q)
      
        const imagesList = []
        const data = []
        querySnap.forEach((doc) => {
          data.push({
            id : doc.id,
            type : doc.data().type,
            image :doc.data().imageUrls[Math.floor(Math.random()*(doc.data().imageUrls.length))]
          })

          imagesList.push(...doc.data().imageUrls)
          
        })
        

        // setListings(imagesList)
        setListings(data)

        setLoading(false)

      } catch (error) {
        toast.error(error!.data?.message || error.message)
      }
    } 
 
    fetchImages()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(loading){
    return <Spinner/>
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
        { listings.map((dataPoint,index) => (
            <SwiperSlide key={index}> 
            <Link to={`/category/${dataPoint.type}/${dataPoint.id}`}>
              <div 
              className="w-full h-full"
              style={{
                background : `url(${dataPoint.image}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              ></div>
              </Link>
            </SwiperSlide>
        )) }
      </Swiper>
  )
}

export default Slider