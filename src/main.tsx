import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider  } from 'react-router-dom'
import Explore from './pages/Explore';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn  from './pages/SignIn.tsx';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword.tsx'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App/>}>
    <Route index path="/" element={<Explore/>}/>
    <Route path="/offers" element={<Offers/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/signIn" element={<SignIn/>}/>
    <Route path="/signUp" element={<SignUp/>}/>
    <Route path="/forgotpassword" element={<ForgotPassword/>}/>
  </Route>
)) 


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
