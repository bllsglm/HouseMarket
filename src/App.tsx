import { Outlet } from "react-router-dom"
import Navbar from "./components/layouts/Navbar"

function App() {

  return (
    <>
      <Navbar/>
      <h1 className="text-3xl font-bold">
       Hello world!
      </h1>
      <Outlet/>
    </>
  )
}

export default App
