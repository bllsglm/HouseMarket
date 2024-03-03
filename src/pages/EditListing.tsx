import {
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db, firebaseAuth } from '../firebase/BaseConfig'
import { toast } from 'react-toastify'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

const EditListing = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true)

  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
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

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setFormData({
          ...docSnap.data(),
          images: [...images],
          address: docSnap.data().location,
        })
        setLoading(false)
      }
    }
    fetchListing()
  }, [params.listingId])

  console.log('form data is', formData)

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

    // Geolocation & Location
    let geolocation = {}
    let location

    if (geoLocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
          import.meta.env.VITE_GEOCODE_API_KEY
        }`
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
        const fileName = `${firebaseAuth.currentUser.uid}-${
          image.name
        }-${uuidv4()}`

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

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })

    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    }

    formDataCopy.location = address
    delete formDataCopy.images
    delete formDataCopy.address
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    await updateDoc(doc(db, 'listings', params.listingId), formDataCopy)
    setLoading(false)
    toast.success('Listing updated')
    navigate(`/category/${formDataCopy.type}/${params.listingId}`)
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
        images: formData.images,
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

  return (
    <div className="flex items-center justify-center min-h-screen mb-16 bg-gray-200">
      <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 p-6 bg-white shadow-md rounded-lg">
        <header className="mb-6">
          <p className="text-2xl font-bold">Edit Listing</p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block mb-2 font-semibold">Sell / Rent</label>
          <div className="flex mb-4">
            <button
              type="button"
              className={`flex-1 mr-2 py-2 text-white font-semibold ${
                type === 'sale' ? 'bg-green-500' : 'bg-gray-400'
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
                type === 'rent' ? 'bg-green-500' : 'bg-gray-400'
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
            maxLength={32}
            minLength={10}
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
                parking ? 'bg-green-500' : 'bg-gray-400'
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
                !parking && parking !== null ? 'bg-green-500' : 'bg-gray-400'
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
                furnished ? 'bg-green-500' : 'bg-gray-400'
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
                !furnished && furnished !== null
                  ? 'bg-green-500'
                  : 'bg-gray-400'
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

          {!geoLocationEnabled && (
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
          )}

          <label className="block mb-2 font-semibold">Offer</label>
          <div className="flex mb-4">
            <button
              className={`flex-1 mr-2 py-2 text-white font-semibold ${
                offer ? 'bg-green-500' : 'bg-gray-400'
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
                ${!offer && offer !== null ? 'bg-green-500' : 'bg-gray-400'}`}
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
              <label className="block mb-2 font-semibold">
                Discounted Price
              </label>
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
            className="w-full py-3 font-semibold text-white bg-blue-500 rounded hover:bg-opacity-80 "
          >
            Edit Listing
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditListing
