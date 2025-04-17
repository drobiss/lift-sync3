//Imports
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebase"

//Component
const Login = () => {
  //Hooks to manage form status (email, password, error)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  //Processing user login via Firebase Authentication
  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (email.trim() === "" || password.trim() === "") {
      setError("Please enter both email and password")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      await signInWithEmailAndPassword(auth, email, password)
      
    } catch (err) {
      console.error("Login error:", err)
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password")
      } else {
        setError("Login failed: " + err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  //Rendering login form
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl text-gray-100 font-bold mb-6 text-center">LiftSync</h2>
        <h3 className="text-lg text-gray-100 font-medium mb-4 text-center">Login</h3>
        
        {error && <p className="text-red-500 mb-4 text-sm" >{error}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input 
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded text-gray-400 bg-gray-900 border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 border rounded text-gray-400 bg-gray-900 border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white p-3 rounded-lg font-medium 
            ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Logging in...
            </span>
          ) : (
            "Log In"
          )}
        </button>
      </form>
    </div>
  )
}

export default Login