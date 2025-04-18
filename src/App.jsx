import { useState, useEffect } from "react"
import Login from "./pages/Login"
import Home from "./pages/Home"
import { auth } from "./firebase/firebase"

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  // Sledování stavu přihlášení uživatele
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="loader w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto h-screen overflow-hidden bg-gray-900">
      {loggedIn ? <Home /> : <Login />}
    </div>
  )
}

export default App