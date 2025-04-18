import { useState, useEffect, useRef } from "react";

const ExerciseGroupCard = ({ exerciseName, entries, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [progressData, setProgressData] = useState({ change: 0, percentage: 0 });
  const historyRef = useRef(null);
  
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return b.createdAt.seconds - a.createdAt.seconds;
  });
  
  // Latest entry for display in card
  const latestEntry = sortedEntries[0];
  
  if (!latestEntry) return null;

  // Calculate progress between latest and second latest entry
  useEffect(() => {
    if (sortedEntries.length >= 2 && sortedEntries[0].weight && sortedEntries[1].weight) {
      const latestWeight = sortedEntries[0].weight;
      const previousWeight = sortedEntries[1].weight;
      
      if (previousWeight > 0) {
        const weightChange = latestWeight - previousWeight;
        const percentChange = ((latestWeight - previousWeight) / previousWeight) * 100;
        
        setProgressData({
          change: weightChange,
          percentage: percentChange.toFixed(1)
        });
      }
    }
  }, [sortedEntries]);

  // Format date in a more readable way
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp.toDate());
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };
  
  // Calculate volume for an entry (weight * sets * reps)
  const calculateVolume = (entry) => {
    if (!entry.weight || !entry.sets || !entry.reps) return null;
    return entry.weight * entry.sets * entry.reps;
  };

  const latestVolume = calculateVolume(latestEntry);
  
  // Determine card border color based on progress
  const getBorderColor = () => {
    if (progressData.change > 0) return "border-green-500";
    if (progressData.change < 0) return "border-red-500";
    return "border-blue-500";
  };

  return (
    <div 
      className={`bg-gray-800 rounded-lg shadow-md ${getBorderColor()} border-l-4 overflow-hidden transition-all duration-300`}
    >
      {/* Main card section (always visible) */}
      <div 
        className="p-4 cursor-pointer relative" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Exercise name and badge */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-100 flex items-center">
              {exerciseName}
              <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </span>
              
              {/* Progress indicator */}
              {progressData.change !== 0 && (
                <span className={`ml-2 text-xs ${progressData.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} px-2 py-0.5 rounded-full flex items-center`}>
                  {progressData.change > 0 ? (
                    <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {Math.abs(progressData.change)}kg ({Math.abs(progressData.percentage)}%)
                </span>
              )}
            </h3>
            
            {/* Latest metrics with visual improvements */}
            <div className="flex flex-wrap gap-3 mt-2">
              {/* Weight */}
              {latestEntry.weight > 0 && (
                <div className="flex items-center bg-gray-700 px-2.5 py-1.5 rounded-md text-gray-300">
                  <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 9V15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    <path d="M18 9V15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    <path d="M3 10V14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    <path d="M21 10V14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    <path d="M3 12H21" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                  <span className="font-medium">{latestEntry.weight} kg</span>
                </div>
              )}

              {/* Sets */}
              {latestEntry.sets > 0 && (
                <div className="flex items-center bg-gray-700 px-2.5 py-1.5 rounded-md text-gray-300">
                  <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="font-medium">{latestEntry.sets} sets</span>
                </div>
              )}

              {/* Reps */}
              {latestEntry.reps > 0 && (
                <div className="flex items-center bg-gray-700 px-2.5 py-1.5 rounded-md text-gray-300">
                  <svg className="w-4 h-4 mr-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h8m-8 4h12m-12 4h16" />
                  </svg>
                  <span className="font-medium">{latestEntry.reps} reps</span>
                </div>
              )}
              
              {/* Volume (if available) */}
              {latestVolume && (
                <div className="flex items-center bg-gray-700 px-2.5 py-1.5 rounded-md text-gray-300">
                  <svg className="w-4 h-4 mr-1 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium">{latestVolume} vol</span>
                </div>
              )}
            </div>

            {/* Latest date with improved formatting */}
            {latestEntry.createdAt && (
              <div className="text-xs text-gray-400 mt-3 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Last: {formatDate(latestEntry.createdAt)}</span>
              </div>
            )}
          </div>
          
          {/* Expand/collapse icon with animation */}
          <div className="text-gray-400 p-1 hover:text-gray-200 transition-colors">
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* History section (expanded view) */}
      <div 
        ref={historyRef}
        className={`px-4 space-y-3 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}
      >
        <div className="flex justify-between items-center border-b border-gray-700 pb-1">
          <h4 className="text-sm font-medium text-gray-300">History</h4>
          
          {/* Filter options could go here */}
          <div className="flex text-xs space-x-2 text-gray-400">
            <button className="hover:text-blue-400 transition-colors">All</button>
            <button className="hover:text-blue-400 transition-colors">Recent</button>
          </div>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {sortedEntries.map((entry, index) => (
            <div 
              key={entry.id} 
              className="bg-gray-700 p-3 rounded-lg relative animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  {/* Progress indicators for each entry */}
                  {index < sortedEntries.length - 1 && sortedEntries[index + 1].weight && entry.weight && (
                    <div className="flex mb-1">
                      {entry.weight > sortedEntries[index + 1].weight ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full flex items-center">
                          <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          {(entry.weight - sortedEntries[index + 1].weight)}kg
                        </span>
                      ) : entry.weight < sortedEntries[index + 1].weight ? (
                        <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full flex items-center">
                          <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          {(sortedEntries[index + 1].weight - entry.weight)}kg
                        </span>
                      ) : null}
                    </div>
                  )}
                  
                  {/* Entry metrics with better visual organization */}
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-300">
                    {entry.weight > 0 && (
                      <div className="flex items-center">
                        <span className="text-blue-400 mr-1 text-xs">Weight:</span>
                        <span>{entry.weight} kg</span>
                      </div>
                    )}
                    
                    {entry.sets > 0 && (
                      <div className="flex items-center">
                        <span className="text-purple-400 mr-1 text-xs">Sets:</span>
                        <span>{entry.sets}</span>
                      </div>
                    )}
                    
                    {entry.reps > 0 && (
                      <div className="flex items-center">
                        <span className="text-green-400 mr-1 text-xs">Reps:</span>
                        <span>{entry.reps}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Volume calculation */}
                  {calculateVolume(entry) && (
                    <div className="mt-1 text-sm text-gray-400">
                      <span className="text-yellow-400 text-xs">Volume:</span> {calculateVolume(entry)}
                    </div>
                  )}

                  {/* Date with improved formatting */}
                  {entry.createdAt && (
                    <div className="text-xs text-gray-500 mt-1.5">
                      {new Date(entry.createdAt.toDate()).toLocaleString('en-US', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
                
                {/* Delete button with improved styling and confirmation */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Confirmation dialog
                    if (window.confirm("Delete this record?")) {
                      onDelete(entry.id);
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors focus:outline-none group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseGroupCard;