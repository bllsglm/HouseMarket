import { Link, useLocation } from 'react-router-dom'
import ExploreIcon from '../assets/icons/ExploreIcon.tsx'
import OfferIcon from '../assets/icons/LocalOfferIcon.tsx'
import PersonOutlineIcon from '../assets/icons/PersonOutlineIcon.tsx'


const Navbar = () => {
  const location = useLocation()

  // Function to determine color based on path
  const matchPath = (path : string) => location.pathname === path ? '#2c2c2c' : '#8c8c8c'

  // Function to determine text color based on path
  const matchText = (path : string) => location.pathname === path ? 'text-[#2c2c2c]' : 'text-[#8c8c8c]'


  return (
    <footer className='fixed bottom-0  w-full bg-slate-100 '>
      <nav className='container mx-auto'>
        <ul className='flex justify-evenly py-1'>
          <li className='flex flex-col items-center'>
            <Link to='/'>
              <ExploreIcon fill={matchPath('/')} width='36px' height='36px'/>
              <p className={matchText('/')}>Explore</p>
            </Link>
          </li>
          <li className='flex flex-col items-center'>
            <Link to='/offers'>
              <OfferIcon fill={matchPath('/offers')} width='36px' height='36px'/>
              <p className={matchText('/offers')}>Offer</p>
            </Link>
          </li>
          <li className='flex flex-col items-center'>
            <Link to='profile'>
              <PersonOutlineIcon fill={matchPath('/profile')} width='36px' height='36px'/>
              <p className={matchText('/profile')}>Profile</p>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Navbar