const ExerciseItem = ({ entry, onDelete }) => {
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-blue-500 relative">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-100">{entry.exercise}</h3>
          
          {/* Exercise metrics */}
          <div className="flex flex-wrap gap-3 mt-2 text-gray-400">
            {/* Exercise weight */}
            {entry.weight > 0 && (
              <div className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 9V15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  <path d="M18 9V15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  <path d="M3 10V14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  <path d="M21 10V14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  <path d="M3 12H21" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
                <span>{entry.weight} kg</span>
              </div>
            )}
            {/* Exercise sets */}
            {entry.sets > 0 && (
              <div className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>{entry.sets} sets</span>
              </div>
            )}
            {/* Exercise reps */}
            {entry.reps > 0 && (
              <div className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>{entry.reps} reps</span>
              </div>
            )}
          </div>

          {/* Exercise date */}
          {entry.createdAt && (
            <div className="text-xs text-gray-400 mt-3 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {new Date(entry.createdAt.toDate()).toLocaleString('cs-CZ', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>
        
        {/* Delete button */}
        <button
          onClick={() => onDelete(entry.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExerciseItem;