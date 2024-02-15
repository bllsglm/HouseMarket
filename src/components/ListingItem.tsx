import { Link } from "react-router-dom"
import { BathtubIcon, BedIcon, DeleteIcon } from "../assets/icons"
import bedIcon from "../assets/svg/bedIcon.svg"

Link
DeleteIcon
BedIcon
BathtubIcon



const ListingItem = ({listing, id, onDelete}) => {

  return (
    <li className="bg-white shadow-lg p-4 my-2 mx-1 rounded-lg flex justify-between items-center hover:bg-green-100">
      <Link to={`/category/${listing.type}/${id}`} className="flex items-center">
        <img src={listing.imageUrls[0]} alt={listing.name} className="w-24 h-24 rounded-lg object-cover" />
        <div className="ml-4">
          <p className="font-semibold text-lg">{listing.name}</p>
          <p className="text-gray-500">{listing.location}</p>
          <p className="text-lg font-semibold">${listing.offer ? listing.discountedPrice.toLocaleString('tr-TR') : listing.regularPrice.toLocaleString('tr-TR')}</p>
          <div className="flex items-center">
            <img src={bedIcon} alt="bedIcon" className="w-6 h-6 mr-1" />
            <p className="text-gray-600">{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}</p>
          </div>
        </div>
      </Link>
      {onDelete && (<DeleteIcon onClick={() => onDelete(listing.id, listing.name)} fill='red' className="cursor-pointer w-6 h-6" />)}
    </li>
  )
}

export default ListingItem 