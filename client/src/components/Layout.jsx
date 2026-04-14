import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useSelector } from "react-redux"
import Loader from "./Loader"
import { useEffect } from "react"

const Layout = () => {
  const { loading: authLoading } = useSelector((state) => state.auth)

  // Add smooth page transition effect
  useEffect(() => {
    // Add a class to the main element for page transitions
    const main = document.querySelector('main')
    if (main) {
      main.classList.add('animate-fade-in')
      const timer = setTimeout(() => {
        main.classList.remove('animate-fade-in')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  if (authLoading) {
    return <Loader />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout