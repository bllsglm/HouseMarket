import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-6xl mb-1">Oops!</h1>
      <p className="my-2 placeholder:">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="shadow-2xl font-extrabold bg-gray-900 text-white gap-4 m-8 p-4 rounded-full hover:bg-opacity-70"
      >
        Back to Home
        <FaHome className="inline pl-1 text-lg" />
      </Link>
    </div>
  )
}

export default NotFound
