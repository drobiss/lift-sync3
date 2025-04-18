import { useState, useEffect, useRef } from "react";

const ExerciseForm = ({ onSubmit, onClose, existingExercises = [] }) => {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Zpracování návrhů při psaní
  useEffect(() => {
    if (exercise.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = existingExercises.filter(ex => 
      ex.toLowerCase().includes(exercise.toLowerCase())
    );
    
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [exercise, existingExercises]);

  // Sledování kliknutí mimo seznam návrhů
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (exercise.trim() === "") return;
    
    onSubmit({
      exercise,
      weight: weight ? Number(weight) : 0,
      sets: sets ? Number(sets) : 0,
      reps: reps ? Number(reps) : 0
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setExercise(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-800 rounded-t-xl w-full max-w-md p-5 shadow-lg animate-slideUp">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-100">Přidat cvik</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Form Drag Handle - mobile pattern */}
        <div className="w-16 h-1 bg-gray-600 mx-auto rounded mb-5"></div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="exercise">
              Název cviku*
            </label>
            <input
              id="exercise"
              type="text"
              placeholder="např. Bench Press"
              className="w-full p-3 rounded-lg text-gray-300 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              required
            />
            
            {/* Autocomplete suggestions */}
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-600 text-gray-300 border-b border-gray-600 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="weight">
                Váha (kg)
              </label>
              <input
                id="weight"
                type="number"
                placeholder="0"
                className="w-full p-3 rounded-lg text-gray-300 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="sets">
                Série
              </label>
              <input
                id="sets"
                type="number"
                placeholder="0"
                className="w-full p-3 rounded-lg text-gray-300 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="reps">
                Opakování
              </label>
              <input
                id="reps"
                type="number"
                placeholder="0"
                className="w-full p-3 rounded-lg text-gray-300 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                min="0"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Uložit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseForm;