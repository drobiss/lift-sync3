import { useState, useRef, useEffect } from "react";

const ExerciseGroupCard = ({ exerciseName, entries, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  // Seřazení záznamů podle data (nejnovější první)
  const sortedEntries = [...entries].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return b.createdAt.seconds - a.createdAt.seconds;
  });
  
  // Nejnovější záznam pro zobrazení v kartě
  const latestEntry = sortedEntries[0];
  
  // Animace zvětšení/zmenšení karty
  useEffect(() => {
    if (cardRef.current) {
      if (isExpanded) {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.focus();
          }
        }, 300); // Po ukončení animace
      }
    }
  }, [isExpanded]);

  // Zavírání karty při kliknutí mimo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && cardRef.current && !cardRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);
  
  if (!latestEntry) return null;

  return (
    <div 
      ref={cardRef}
      className={`relative bg-gray-800 rounded-lg shadow-md border-l-4 border-blue-500 
        transition-all duration-300 overflow-hidden
        ${isExpanded 
          ? 'fixed inset-x-4 top-24 bottom-20 z-50 flex flex-col' 
          : 'hover:shadow-lg hover:translate-y-[-2px]'}`}
    >
      {/* Hlavní část karty (vždy viditelná) */}
      <div 
        className={`p-4 cursor-pointer ${isExpanded ? 'border-b border-gray-700' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-100 flex items-center">
              {exerciseName}
              <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                {entries.length} {entries.length === 1 ? 'záznam' : entries.length < 5 ? 'záznamy' : 'záznamů'}
              </span>
            </h3>
            
            {/* Nejnovější metriky */}
            <div className="flex flex-wrap gap-3 mt-2 text-gray-400">
              {/* Váha */}
              {latestEntry.weight > 0 && (
                <div className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 9V15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    <path d="M18 9V15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    <path d="M3 10V14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    <path d="M21 10V14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    <path d="M3 12H21" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                  <span>{latestEntry.weight} kg</span>
                </div>
              )}

              {/* Série */}
              {latestEntry.sets > 0 && (
                <div className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>{latestEntry.sets} sérií</span>
                </div>
              )}

              {/* Opakování */}
              {latestEntry.reps > 0 && (
                <div className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>{latestEntry.reps} opakování</span>
                </div>
              )}
            </div>

            {/* Datum nejnovějšího záznamu */}
            {latestEntry.createdAt && (
              <div className="text-xs text-gray-400 mt-3 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  Poslední: {new Date(latestEntry.createdAt.toDate()).toLocaleString('cs-CZ', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
          
          {/* Ikona rozbalení/sbalení */}
          <div className="text-gray-400">
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
      
      {/* Rozšířená část karty (viditelná pouze po kliknutí) */}
      {isExpanded && (
        <>
          {/* Záhlaví historie */}
          <div className="px-4 pt-4 pb-2 flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-300">Historie záznamů</h4>
            
            {/* Zavírací tlačítko */}
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Scrollovatelný kontejner s historií */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 py-2 space-y-3 focus:outline-none"
            tabIndex={0} // Umožňuje fokus pro klávesovou navigaci
          >
            {sortedEntries.map((entry, index) => (
              <div 
                key={entry.id} 
                className="bg-gray-700 p-3 rounded-lg relative hover:bg-gray-650 transition-colors"
              >
                <div className="flex justify-between">
                  <div>
                    {/* Metriky záznamu */}
                    <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                      {entry.weight > 0 && <span>{entry.weight} kg</span>}
                      {entry.weight > 0 && entry.sets > 0 && <span>•</span>}
                      {entry.sets > 0 && <span>{entry.sets} sérií</span>}
                      {entry.sets > 0 && entry.reps > 0 && <span>•</span>}
                      {entry.reps > 0 && <span>{entry.reps} opakování</span>}
                    </div>

                    {/* Datum záznamu */}
                    {entry.createdAt && (
                      <div className="text-xs text-gray-400 mt-1.5">
                        {new Date(entry.createdAt.toDate()).toLocaleString('cs-CZ', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Tlačítko smazat */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(entry.id);
                    }}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExerciseGroupCard;