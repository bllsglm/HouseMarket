import { Link } from "react-router-dom"
import { BathtubIcon, BedIcon, DeleteIcon } from "../assets/icons"
import bedIcon from "../assets/svg/bedIcon.svg"

Link
DeleteIcon
BedIcon
BathtubIcon


const ListingItem = ({listing, id}) => {
  return (
    <li>
      <Link to={`/category/${listing.type}/${id}`}
      className="categoryListingLink"
      >
        <img src={listing.imageUrls[0]} alt={listing.name}
        className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">
            {listing.location}
          </p>
          <p className="CategoryListingName">{listing.name}</p>
          <p>${listing.offer ? listing.discountedPrice.toLocaleString('tr-TR')  : listing.regularPrice.toLocaleString('tr-TR')}
          {listing.type === 'rent' && '/month'}
          </p>
          <img src={bedIcon} alt="bedIcon" />
          <p> {listing.bedrooms > 1 ? ` ${listing.bedrooms} Bedrooms` : '1 Bedroom'} </p>
        </div>
      </Link>
    </li>
  )
}

export default ListingItem 