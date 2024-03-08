import { doc, getDoc } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { db } from '../firebase/BaseConfig'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'

const Contact = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState({
    name: '',
    email: '',
  })

  const [searchParams] = useSearchParams()
  const params = useParams()

  useEffect(() => {
    const fetchLandlord = async () => {
      setLoading(true)
      if (!params.landlordId) return
      const userRef = doc(db, 'users', params.landlordId)
      const docSnap = await getDoc(userRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        setUser(data as { name: string; email: string })
        setLoading(false)
      } else {
        toast.error('Landlord can not be found')
      }
    }

    fetchLandlord()
  }, [params])

  if (loading) {
    return <Spinner />
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-2xl border-b-4 border-cyan-950 mb-8">
        Landlord Contact Info
      </h2>
      <p>Name : {user.name}</p>
      <p className="mb-4">Email : {user.email}</p>

      <form className="flex flex-col justify-center items-center">
        <textarea
          className="border border-black bg-gray-100"
          name="text"
          id=""
          cols={25}
          rows={5}
          value={message}
          onChange={handleChange}
        ></textarea>
        <a
          href={`mailto:${user.email}?Subject=${searchParams.get(
            'listingName'
          )}&body=${message}`}
        >
          <button
            className="mt-4 bg-blue-500 text-white rounded-2xl p-2 hover:bg-blue-400"
            type="button"
          >
            Send Email
          </button>
        </a>
      </form>
    </div>
  )
}

export default Contact
