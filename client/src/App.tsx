import {HeatMap} from './components/HeatMap'
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Settings2} from "lucide-react";
import Settings from "@/components/Settings.tsx";


function App() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)


    return (
        <main className='w-screen h-screen'>
            <HeatMap/>
            <Button
                variant="secondary"
                size="icon"
                className="top-4 left-4 z-10 bg-white/90 hover:bg-white/75 shadow-md"
                onClick={() => setIsSettingsOpen(true)}
            >
                <Settings2 className="h-5 w-5"/>
                <span className="sr-only">Open settings</span>
            </Button>
            {isSettingsOpen && <Settings setIsSettingsOpen={setIsSettingsOpen}/>}
        </main>
    )
}

export default App