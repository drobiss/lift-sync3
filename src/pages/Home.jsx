import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase"; // Import auth
import { deleteDoc, doc } from "firebase/firestore";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  where // Import where pro filtrování dat podle uživatele
} from "firebase/firestore";

const Home = () => {
  // States for form data and UI control
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Form data states
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  // Sledování aktuálně přihlášeného uživatele
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    
    return () => unsubscribe();
  }, []);

  // Reset form data
  const resetForm = () => {
    setExercise("");
    setWeight("");
    setSets("");
    setReps("");
  };

  // Handle form submission
  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }
    
    if (exercise.trim() === "") return;

    try {
      await addDoc(collection(db, "entries"), {
        exercise,
        weight: weight ? Number(weight) : 0,
        sets: sets ? Number(sets) : 0,
        reps: reps ? Number(reps) : 0,
        createdAt: serverTimestamp(),
        userId: currentUser.uid // Přidání userId k záznamu
      });
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving exercise:", err);
    }
  };

  // Delete an entry
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "entries", id));
    } catch (err) {
      console.error("Error deleting exercise:", err);
    }
  };

  // Odhlášení
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Při odhlášení budete přesměrováni na přihlašovací stránku díky App.jsx
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Load data in real-time - only for the current user
  useEffect(() => {
    if (!currentUser) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Upravená query, která načítá pouze záznamy patřící aktuálnímu uživateli
    const q = query(
      collection(db, "entries"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newEntries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setEntries(newEntries);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching exercises:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]); // Závislost na currentUser zajistí, že se data načtou znovu při změně uživatele

  // Filter entries
  const filteredEntries = entries.filter(entry => 
    entry.exercise.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 max-w-md mx-auto relative min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Workout Tracker</h1>
        
        {/* Zobrazení informací o uživateli a tlačítko pro odhlášení */}
        {currentUser && (
          <div className="flex items-center">
            <div className="mr-2 text-sm text-gray-500">{currentUser.email}</div>
            <button 
              onClick={handleLogout}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Search and Add Button */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search exercises..."
            className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          Nejste přihlášeni
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {filter ? "No exercises found matching your search" : "No exercises added yet"}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{entry.exercise}</h3>
                  <div className="flex gap-4 mt-2 text-gray-600">
                    {entry.weight > 0 && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                        </svg>
                        <span>{entry.weight} kg</span>
                      </div>
                    )}
                    {entry.sets > 0 && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span>{entry.sets} sets</span>
                      </div>
                    )}
                    {entry.reps > 0 && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>{entry.reps} reps</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Exercise Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-5 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add Exercise</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAdd}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="exercise">
                  Exercise Name*
                </label>
                <input
                  id="exercise"
                  type="text"
                  placeholder="e.g., Bench Press"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weight">
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    placeholder="0"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sets">
                    Sets
                  </label>
                  <input
                    id="sets"
                    type="number"
                    placeholder="0"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reps">
                    Reps
                  </label>
                  <input
                    id="reps"
                    type="number"
                    placeholder="0"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;