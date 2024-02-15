import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../firebase/BaseConfig';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/BaseConfig';
useNavigate
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'


useNavigate
Spinner
useRef

const CreateListing = () => {
  const [loading, setLoading] = useState(false)
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice :0,
    discountedPrice : 0,
    images : {},
    latitude : 0,
    longitude :0,
  })

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
    
  } = formData

  
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(() => {
    if(isMounted){
      onAuthStateChanged(firebaseAuth, (user) => {
        if(user){
          
          setFormData({...formData, userRef : user.uid})
          
        }else{
          navigate('/signIn')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted,navigate])



  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    if (discountedPrice >= regularPrice) {
      setLoading(false)
      toast.error('Discounted price needs to be less than regular price')
      return
    }

    if (images.length > 6) {
      setLoading(false)
      toast.error('Max 6 images')
      return
    }

    let geolocation = {}
    let location

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      )

      const data = await response.json()

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0

      location =
        data.status === 'ZERO_RESULTS'
          ? undefined
          : data.results[0]?.formatted_address

      if (location === undefined || location.includes('undefined')) {
        setLoading(false)
        toast.error('Please enter a correct address')
        return
      }
    } else {
      geolocation.lat = latitude
      geolocation.lng = longitude
    }

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${firebaseAuth.currentUser.uid}-${image.name}-${uuidv4()}`

        const storageRef = ref(storage, 'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    }

    formDataCopy.location = address
    delete formDataCopy.images
    delete formDataCopy.address
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
    setLoading(false)
    toast.success('Listing saved')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  if (loading) {
    return <Spinner />
  }


 
  return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 p-6 bg-white shadow-md rounded-lg overflow-y-auto">
      <header className="mb-6">
        <p className="text-2xl font-bold">Create a Listing</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4">
          <label className="block mb-2 font-semibold">Sell / Rent</label>
          <div className="flex mb-4">
            <button
              type="button"
              className={`flex-1 mr-2 py-2 text-white font-semibold ${
                type === 'sale' ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-white font-semibold ${
                type === 'rent' ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
  
          <label className="block mb-2 font-semibold">Name</label>
          <input
            className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            required
          />
  
          <div className="flex mb-4">
            <div className="mr-4">
              <label className="block mb-2 font-semibold">Bedrooms</label>
              <input
                className="block w-full px-4 py-2 mb-2 border border-gray-300 rounded"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Bathrooms</label>
              <input
                className="block w-full px-4 py-2 mb-2 border border-gray-300 rounded"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>
  
          <label className="block mb-2 font-semibold">Parking spot</label>
          <div className="flex mb-4">
            <button
              className={`flex-1 mr-2 py-2 text-white font-semibold ${
                parking ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              type="button"
              id="parking"
              value={true}
              onClick={onMutate}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              className={`flex-1 py-2 text-white font-semibold ${
                !parking && parking !== null ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              type="button"
              id="parking"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
  
          <label className="block mb-2 font-semibold">Furnished</label>
          <div className="flex mb-4">
            <button
              className={`flex-1 mr-2 py-2 text-white font-semibold ${
                furnished ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              type="button"
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={`flex-1 py-2 text-white font-semibold ${
                !furnished && furnished !== null ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              type="button"
              id="furnished"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
  
          <label className="block mb-2 font-semibold">Address</label>
          <textarea
            className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />
  
          <div className="flex mb-4">
            <div className="mr-4">
              <label className="block mb-2 font-semibold">Latitude</label>
              <input
                className="block w-full px-4 py-2 mb-2 border border-gray-300 rounded"
                type="number"
                id="latitude"
                value={latitude}
                onChange={onMutate}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Longitude</label>
              <input
                className="block w-full px-4 py-2 mb-2 border border-gray-300 rounded"
                type="number"
                id="longitude"
                value={longitude}
                onChange={onMutate}
                required
              />
            </div>
          </div>
  
          <label className="block mb-2 font-semibold">Offer</label>
          <div className="flex mb-4">
            <button
              className={`flex-1 mr-2 py-2 text-white font-semibold ${
                offer ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={`flex-1 py-2 text-white font-semibold 
                ${!offer && offer !== null ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
  
          <label className="block mb-2 font-semibold">Regular Price</label>
          <div className="flex mb-4">
            <input
              className="block w-full px-4 py-2 mb-2 border border-gray-300 rounded"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {type === 'rent' && (
              <p className="flex items-center ml-2 text-gray-600">$/Month</p>
            )}
          </div>
  
          {offer && (
            <>
              <label className="block mb-2 font-semibold">Discounted Price</label>
              <input
                className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={offer}
              />
            </>
          )}
  
          <label className="block mb-2 font-semibold">Images</label>
          <p className="mb-4 text-gray-600">
            The first image will be the cover (max 6).
          </p>
          <input
            className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
  
          <button
          type="submit"
          className="w-full py-3 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
          Create Listing
          </button>
          </form>
        </div>
      </div>
  );
  
}

export default CreateListing