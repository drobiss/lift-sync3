import { useState } from "react";

const ExerciseForm = ({ onSubmit, onClose }) => {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      exercise,
      weight: weight ? Number(weight) : 0,
      sets: sets ? Number(sets) : 0,
      reps: reps ? Number(reps) : 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-100">Add Exercise</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="exercise">
              Exercise Name*
            </label>
            <input
              id="exercise"
              type="text"
              placeholder="e.g., Bench Press"
              className="w-full p-2 border rounded text-gray-400 bg-gray-900 border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="weight">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                placeholder="0"
                className="w-full p-2 border rounded text-gray-400 bg-gray-900 border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="sets">
                Sets
              </label>
              <input
                id="sets"
                type="number"
                placeholder="0"
                className="w-full p-2 border rounded text-gray-400 bg-gray-900 border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="reps">
                Reps
              </label>
              <input
                id="reps"
                type="number"
                placeholder="0"
                className="w-full p-2 border rounded text-gray-400 bg-gray-900 border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
              className="px-4 py-2 bg-gray-200 text-blue-500 rounded hover:bg-gray-300 transition-colors"
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
  );
};

export default ExerciseForm;