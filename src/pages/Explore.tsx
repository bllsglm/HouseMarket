import { Link } from "react-router-dom"
import rentCategoryImage  from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage  from '../assets/jpg/sellCategoryImage.jpg'


const Explore = () => {
  return (
    <div className="flex flex-col justify-center items-center">
  <header>
    <p className="mt-8 text-4xl font-extrabold">Explore</p>
  </header>

  <main className="mt-2">
    <p className="text-center">Categories</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 m-2 justify-center">
      <Link to='/category/rent' className="relative mb-10">
        <img className="rounded-2xl h-80 w-auto max-w-full" src={rentCategoryImage} alt="Places for Rent" />
        <p className="absolute bottom-0 left-0 right-0 text-center bg-white bg-opacity-75">Places for Rent</p>
      </Link>
      <Link to='/category/sell' className="relative mb-10">
        <img className="rounded-2xl h-80 w-auto max-w-full" src={sellCategoryImage} alt="Places for Sale" />
        <p className="absolute bottom-0 left-0 right-0 text-center bg-white bg-opacity-75">Places for Sale</p>
      </Link>
    </div>
  </main>
</div>
  )
}

export default Explore