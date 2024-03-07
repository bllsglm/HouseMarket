import { Link, useLocation } from 'react-router-dom'
import exploreIcon from '../assets/svg/exploreIcon.svg'
import offerIcon from '../assets/svg/localOfferIcon.svg'
import personOutlineIcon from '../assets/svg/personOutlineIcon.svg'

const Navbar = () => {
  const location = useLocation()

  // Function to determine text color based on path
  const matchText = (path: string) =>
    location.pathname === path
      ? 'text-[#2c2c2c] font-extrabold text-green-600'
      : 'text-[#8c8c8c]'

  return (
    <footer className="fixed bottom-0  w-screen bg-slate-100 z-50">
      <nav className="container mx-auto">
        <ul className="flex justify-evenly py-1">
          <li className="flex flex-col items-center">
            <Link to="/">
              <img
                src={exploreIcon}
                alt=""
                style={{ width: '36px', height: '36px' }}
              />
              <p className={matchText('/')}>Explore</p>
            </Link>
          </li>
          <li className="flex flex-col items-center">
            <Link to="/offers">
              <img
                src={offerIcon}
                alt=""
                style={{ width: '36px', height: '36px' }}
              />
              <p className={matchText('/offers')}>Offer</p>
            </Link>
          </li>
          <li className="flex flex-col items-center">
            <Link to="profile">
              <img
                src={personOutlineIcon}
                alt=""
                style={{ width: '36px', height: '36px' }}
              />
              <p className={matchText('/profile')}>Profile</p>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Navbar
