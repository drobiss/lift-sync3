import { useState } from 'react';

const BottomNavigation = ({ onAddClick }) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // V budoucnu zde můžeme přidat navigaci mezi stránkami
    
    // Pokud je kliknuto na "add" tlačítko, zavoláme handler z props
    if (tab === 'add' && onAddClick) {
      onAddClick();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-2 py-1 flex justify-around items-center z-50">
      {/* Home Button */}
      <button 
        onClick={() => handleTabClick('home')}
        className={`p-2 rounded-lg flex flex-col items-center w-16 ${activeTab === 'home' ? 'text-blue-500' : 'text-gray-400'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-xs mt-1">Home</span>
      </button>

      {/* Stats Button */}
      <button 
        onClick={() => handleTabClick('stats')}
        className={`p-2 rounded-lg flex flex-col items-center w-16 ${activeTab === 'stats' ? 'text-blue-500' : 'text-gray-400'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="text-xs mt-1">Stats</span>
      </button>

      {/* Add Button */}
      <button 
        onClick={() => handleTabClick('add')}
        className="p-2 rounded-full bg-blue-500 text-white flex justify-center items-center -mt-5 shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Routines Button */}
      <button 
        onClick={() => handleTabClick('routines')}
        className={`p-2 rounded-lg flex flex-col items-center w-16 ${activeTab === 'routines' ? 'text-blue-500' : 'text-gray-400'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className="text-xs mt-1">Routines</span>
      </button>

      {/* Profile Button */}
      <button 
        onClick={() => handleTabClick('profile')}
        className={`p-2 rounded-lg flex flex-col items-center w-16 ${activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-xs mt-1">Profile</span>
      </button>
    </div>
  );
};

export default BottomNavigation;