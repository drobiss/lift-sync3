import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (email.trim() === "" || password.trim() === "") {
      setError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password");
      } else if (err.code === 'auth/user-not-found') {
        setError("User with this email does not exist");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many attempts. Try again later");
      } else {
        setError("Login failed: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 px-6">
      {/* Title */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Lift<span className="text-blue-500">Sync</span></h2>
        <p className="text-gray-400 mt-1">Track your progress</p>
      </div>
      
      <div className="w-full max-w-sm">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl text-gray-100 font-medium mb-6">Login</h3>
            
            <form onSubmit={handleLogin}>
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <div className="mb-5">
                <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input 
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full py-3 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full py-3 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg transition-all
                  hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-0.5 active:scale-95'}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Logging in...
                  </span>
                ) : (
                  "Log In"
                )}
              </button>
            </form>
          </div>
          
          <div className="py-4 px-6 bg-gray-750 bg-opacity-50 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              Don't have an account? Contact the app administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;