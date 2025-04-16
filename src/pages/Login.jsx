//Imports
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebase"

//Component
const Login = ({ onLogin }) => {
  //Hooks to manage form status (email, password, error)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  //Processing user login via Firebase Authentication
  const handleLogin = async () => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch (err){
      setError("Invalid Information")
    }
  }
  //Rendering login form
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center"></h2>
        {error && <p className="text-red-500 mb-2" >{error}</p>}
        <input 
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login