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
import ExerciseGroupCard from "../components/ExerciseGroupCard";
import BottomNavigation from "../components/BottomNavigation";

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

  // Group entries by exercise name
  const groupEntriesByExercise = (entries) => {
    const groups = {};
    
    entries.forEach(entry => {
      const exerciseName = entry.exercise;
      
      if (!groups[exerciseName]) {
        groups[exerciseName] = [];
      }
      
      groups[exerciseName].push(entry);
    });
    
    return groups;
  };

  // Filter entries
  const filterExerciseGroups = (groups) => {
    if (!filter) return groups;
    
    const filteredGroups = {};
    Object.keys(groups).forEach(exerciseName => {
      if (exerciseName.toLowerCase().includes(filter.toLowerCase())) {
        filteredGroups[exerciseName] = groups[exerciseName];
      }
    });
    
    return filteredGroups;
  };
  
  // Get unique exercise names for autocomplete
  const getUniqueExerciseNames = () => {
    const names = new Set();
    entries.forEach(entry => {
      if (entry.exercise) {
        names.add(entry.exercise);
      }
    });
    return Array.from(names);
  };
  
  // Group entries by exercise name
  const exerciseGroups = groupEntriesByExercise(entries);
  
  // Apply filter
  const filteredGroups = filterExerciseGroups(exerciseGroups);
  
  // Sort groups by the date of the most recent entry
  const sortedGroupNames = Object.keys(filteredGroups).sort((a, b) => {
    const entriesA = filteredGroups[a];
    const entriesB = filteredGroups[b];
    
    // Find the most recent entry in each group
    const latestA = entriesA.reduce((latest, entry) => {
      if (!latest || !latest.createdAt) return entry;
      if (!entry.createdAt) return latest;
      return entry.createdAt.seconds > latest.createdAt.seconds ? entry : latest;
    }, null);
    
    const latestB = entriesB.reduce((latest, entry) => {
      if (!latest || !latest.createdAt) return entry;
      if (!entry.createdAt) return latest;
      return entry.createdAt.seconds > latest.createdAt.seconds ? entry : latest;
    }, null);
    
    // Compare dates
    if (!latestA?.createdAt) return 1;
    if (!latestB?.createdAt) return -1;
    
    return latestB.createdAt.seconds - latestA.createdAt.seconds;
  });
  
  // Handle adding exercise from bottom nav
  const handleAddClick = () => {
    setShowForm(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Fixed Header */}
      <div className="px-4 pt-4 pb-2 bg-gray-900 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-100">Lift<span className="text-blue-500">Sync</span></h1>
          
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            Logout
          </button>
        </div>
        
        {/* Debug info - collapsible */}
        {debug && (
          <div className="mt-2 text-xs bg-gray-800 p-2 rounded-md flex justify-between">
            <div className="text-gray-400 truncate">{debug}</div>
            <button 
              onClick={handleRefresh} 
              className="text-blue-500 hover:text-blue-700 ml-2 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Search */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search exercise..."
            className="w-full py-2 pl-4 pr-10 rounded-full border text-gray-400 bg-gray-800 border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
      </div>

      {/* Scrollable Exercise List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        {isLoading ? (
          <div className="flex justify-center mt-10">
            <div className="loader w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !currentUser ? (
          <div className="text-center py-10 text-gray-500">
            Nejste přihlášeni
          </div>
        ) : sortedGroupNames.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {filter ? "Nenalezeny žádné cviky odpovídající vašemu vyhledávání" : "Zatím nebyly přidány žádné cviky"}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedGroupNames.map((exerciseName) => (
              <ExerciseGroupCard 
                key={exerciseName}
                exerciseName={exerciseName}
                entries={filteredGroups[exerciseName]}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation onAddClick={handleAddClick} />

      {/* Add Exercise Modal */}
      {showForm && (
        <ExerciseForm 
          onSubmit={handleAdd}
          onClose={() => setShowForm(false)}
          existingExercises={getUniqueExerciseNames()}
        />
      )}
    </div>
  );
};

export default Home;