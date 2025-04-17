import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase"; 
import { deleteDoc, doc } from "firebase/firestore";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  serverTimestamp,
  where,
  getDocs
} from "firebase/firestore";
import ExerciseForm from "../components/ExerciseForm";
import ExerciseItem from "../components/ExerciseItem";

const Home = () => {
  // States for form data and UI control
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [debug, setDebug] = useState("");
  
  // Tracking the currently logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      // Debug info
      if (user) {
        console.log("User ID:", user.uid);
        setDebug(`User authenticated: ${user.uid.substring(0, 6)}...`);
      } else {
        console.log("No user logged in");
        setDebug("No user authenticated");
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Handle form submission
  const handleAdd = async (formData) => {
    if (!currentUser) {
      console.error("No user logged in");
      setDebug("Error: User not logged in");
      return;
    }
    
    if (formData.exercise.trim() === "") return;

    try {
      // Debug info before adding entry
      console.log("Adding exercise with userId:", currentUser.uid);
      
      const docRef = await addDoc(collection(db, "entries"), {
        ...formData,
        createdAt: serverTimestamp(),
        userId: currentUser.uid
      });
      
      console.log("Document added with ID:", docRef.id);
      setDebug(`Exercise added: ${formData.exercise} (ID: ${docRef.id.substring(0, 6)}...)`);
      
      setShowForm(false);
      
      // Instantly reload data again
      fetchData();
      
    } catch (err) {
      console.error("Error saving exercise:", err);
      setDebug(`Saving error: ${err.message}`);
    }
  };

  // Functions for manual data loading
  const fetchData = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching data for userId:", currentUser.uid);
      
      const q = query(
        collection(db, "entries"),
        where("userId", "==", currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const newEntries = [];
      
      querySnapshot.forEach((doc) => {
        console.log("Document data:", doc.data());
        newEntries.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`Found ${newEntries.length} entries`);
      setDebug(`Loaded ${newEntries.length} records`);
      
      // Manually sorting
      newEntries.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      });
      
      setEntries(newEntries);
    } catch (err) {
      console.error("Error fetching exercises:", err);
      setDebug(`Error loading data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an entry
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "entries", id));
      setDebug(`Record deleted: ${id.substring(0, 6)}...`);
      
      // Instantly reload data again
      fetchData();
    } catch (err) {
      console.error("Error deleting exercise:", err);
      setDebug(`Error in deleting: ${err.message}`);
    }
  };

  // Log out
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setDebug("User logged out");
    } catch (error) {
      console.error("Error signing out:", error);
      setDebug(`Error logging out: ${error.message}`);
    }
  };

  // Retrieving data on user change
  useEffect(() => {
    if (!currentUser) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    fetchData();
    
    // Real-time listener settings
    try {
      console.log("Setting up real-time listener");
      
      const q = query(
        collection(db, "entries"),
        where("userId", "==", currentUser.uid)
      );
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log(`Snapshot received with ${snapshot.docs.length} docs`);
          
          const newEntries = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Sort manually
          newEntries.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return b.createdAt.seconds - a.createdAt.seconds;
          });
          
          setEntries(newEntries);
          setIsLoading(false);
          setDebug(`Real-time updates: ${newEntries.length} records`);
        },
        (error) => {
          console.error("Error in snapshot listener:", error);
          setDebug(`Error in real-time listener: ${error.message}`);
          setIsLoading(false);
          fetchData();
        }
      );

      return () => {
        console.log("Unsubscribing from real-time listener");
        unsubscribe();
      };
    } catch (err) {
      console.error("Error setting up snapshot listener:", err);
      setDebug(`Listener setting error: ${err.message}`);
      setIsLoading(false);
      fetchData();
    }
  }, [currentUser]);

  // Added handler for manual data recovery
  const handleRefresh = () => {
    setDebug("Manual data recovery...");
    fetchData();
  };

  // Filter entries
  const filteredEntries = entries.filter(entry => 
    entry.exercise.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 max-w-md mx-auto relative min-h-screen bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-gray-100">Progress Tracker</h1>
        
        {/* View user information and logout button */}
        {currentUser && (
          <div className="flex items-center">
            
            <button 
              onClick={handleLogout}
              className="font-medium text-sm text-white bg-blue-500 hover:bg-blue-700 
              px-4 py-2 rounded-md shadow-sm transition-all duration-200 
              border border-blue-700 hover:shadow active:scale-98"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      
      {/* Debug info */}
      {debug && (
        <div className="my-5 text-xs bg-gray-800 p-3 rounded-md flex justify-between">
          <div className="text-gray-400">{debug}</div>
          <button 
            onClick={handleRefresh} 
            className="text-blue-500 hover:text-blue-700"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Search and Add Button */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search exercises..."
            className="w-full py-2 pl-4 pr-10 rounded-full border text-gray-400 bg-gray-900 border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <svg 
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700"
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
        </button>
      </div>

      {/* Exercise List */}
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <div className="loader w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !currentUser ? (
        <div className="text-center py-10 text-gray-500">
          You're not logged in
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {filter ? "No exercises found matching your search" : "No exercises added yet"}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <ExerciseItem 
              key={entry.id} 
              entry={entry} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add Exercise Modal */}
      {showForm && (
        <ExerciseForm 
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Home;