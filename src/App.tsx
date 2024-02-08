import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"

function App() {

  return (
    <>
     
      <h1 className="text-3xl font-bold">
       Hello world!
      </h1>
     
     
      <Outlet/>
      <Navbar/>
    </>
  )
}

export default App
