import { useState, useEffect } from 'react';

const BottomNavigation = ({ onAddClick }) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // Pokud je kliknuto na "add" tlačítko, zavoláme handler z props
    if (tab === 'add' && onAddClick) {
      onAddClick();
    }
  };

  // Efekt pro animaci vlnky
  useEffect(() => {
    // Zde by mohla být implementace pokročilejší animace pokud by to bylo potřeba
  }, [activeTab]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Stínový efekt na horní hraně */}
     
      
      {/* Hlavní navigační panel */}
      <div className="bg-gray-800 backdrop-blur-lg bg-opacity-95 border-t border-gray-700 rounded-t-xl px-4 pt-1 pb-1 flex justify-around items-center shadow-xl">
        {/* Home Button */}
        <button 
          onClick={() => handleTabClick('home')}
          className={`relative p-2 flex flex-col items-center w-16 transition-all duration-300 ${
            activeTab === 'home' 
              ? 'text-blue-400 translate-y-0' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {activeTab === 'home' && (
            <span className="absolute -top-1 w-8 h-1 bg-blue-400 rounded-full" />
          )}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'home' ? 2.5 : 1.5} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className={`text-xs mt-1 font-medium transition-all ${activeTab === 'home' ? 'opacity-100' : 'opacity-70'}`}>Home</span>
        </button>

        {/* Stats Button */}
        <button 
          onClick={() => handleTabClick('stats')}
          className={`relative p-2 flex flex-col items-center w-16 transition-all duration-300 ${
            activeTab === 'stats' 
              ? 'text-blue-400 translate-y-0' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {activeTab === 'stats' && (
            <span className="absolute -top-1 w-8 h-1 bg-blue-400 rounded-full" />
          )}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'stats' ? 2.5 : 1.5} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className={`text-xs mt-1 font-medium transition-all ${activeTab === 'stats' ? 'opacity-100' : 'opacity-70'}`}>Stats</span>
        </button>

        {/* Add Button - upravená verze */}
        <button 
          onClick={() => handleTabClick('add')}
          className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex justify-center items-center -mt-7 shadow-lg hover:shadow-blue-500/40 active:scale-95 transition-all duration-300"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="sr-only">Add Exercise</span>
        </button>

        {/* Routines Button */}
        <button 
          onClick={() => handleTabClick('routines')}
          className={`relative p-2 flex flex-col items-center w-16 transition-all duration-300 ${
            activeTab === 'routines' 
              ? 'text-blue-400 translate-y-0' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {activeTab === 'routines' && (
            <span className="absolute -top-1 w-8 h-1 bg-blue-400 rounded-full" />
          )}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'routines' ? 2.5 : 1.5} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className={`text-xs mt-1 font-medium transition-all ${activeTab === 'routines' ? 'opacity-100' : 'opacity-70'}`}>Routines</span>
        </button>

        {/* Profile Button */}
        <button 
          onClick={() => handleTabClick('profile')}
          className={`relative p-2 flex flex-col items-center w-16 transition-all duration-300 ${
            activeTab === 'profile' 
              ? 'text-blue-400 translate-y-0' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {activeTab === 'profile' && (
            <span className="absolute -top-1 w-8 h-1 bg-blue-400 rounded-full" />
          )}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'profile' ? 2.5 : 1.5} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className={`text-xs mt-1 font-medium transition-all ${activeTab === 'profile' ? 'opacity-100' : 'opacity-70'}`}>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;