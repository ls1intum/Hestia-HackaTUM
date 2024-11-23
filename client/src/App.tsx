import {useState} from 'react';
import {HeatMap} from './components/HeatMap';
import {FaCog} from 'react-icons/fa';
import Settings from "@/components/Settings.tsx";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (<main className="relative w-full h-full">

    <div>
      <HeatMap />

      <button
        className="fixed top-2 right-2 p-4 bg-white rounded-full shadow-md text-gray-700 hover:text-gray-900 focus:outline-none z-50"
        onClick={() => setIsSettingsOpen(true)}
        aria-label="Settings"
      >
        <FaCog size={24}/>
      </button>
    </div>


    {isSettingsOpen && (<Settings setIsSettingsOpen={setIsSettingsOpen}/>)}
  </main>);
}

export default App;
