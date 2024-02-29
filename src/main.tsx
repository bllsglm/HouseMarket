import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider  } from 'react-router-dom'
import Explore from './pages/Explore';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn  from './pages/SignIn.tsx';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import Category from './pages/Category.tsx'
import CreateListing from './pages/CreateListing.tsx'
import Listing from './pages/Listing.tsx'
import Contact from './pages/Contact.tsx'



const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App/>}>
    <Route index path="/" element={<Explore/>}/>
    <Route path="/offers" element={<Offers/>}/>
    <Route path="/category/:categoryName" element={<Category/>}/>
    <Route path="/signIn" element={<SignIn/>}/>
    <Route path="/signUp" element={<SignUp/>}/>
    <Route path="/forgotpassword" element={<ForgotPassword/>}/>
    <Route path="/create-listing" element={<CreateListing/>}/>
    <Route path="/contact/:landlordId" element={<Contact/>}/>
    <Route path="/category/:categoryName/:listingId" element={<Listing/>}/>
    <Route path='' element={< PrivateRoute/>}>
      <Route path="/profile" element={<Profile/>}/>
    </Route>
  </Route>
)) 


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
