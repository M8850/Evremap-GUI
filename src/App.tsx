// App.tsx
import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import DropdownMenu2 from "./DropdownMenu2";
import EvremapGUIComp from "./EvremapGUIComp3";
import RemapSection from "./RemapSection";
import TOMLPreview from "./TOMLPreview";

interface DualRoleEntry {
  input: string[];
  hold: string[];
  tap: string[];
}

interface RemapEntry {
  input: string[];
  output: string[];
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [deviceName, setDeviceName] = useState<string>("");
  const [selectedPhys, setSelectedPhys] = useState<string | null>(null);
  const [entries, setEntries] = useState({
    dualRoleEntries: [{ input: [], hold: [], tap: [] }],
    remapEntries: [{ input: [], output: [] }],
  });

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

/*<p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
      */

  return (
    <div className="container">
      <h4>Evremap GUI config file editor</h4>

      <div className="row">
      <a href="https://github.com/wez/evremap" target="_blank">
          <img src="/wezterm-icon.svg" className="logo vite" alt="logo" />
        </a>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      
      <DropdownMenu2
        setDeviceName={(deviceName) => setDeviceName(deviceName)}
        setSelectedPhys={(selectedPhys) => setSelectedPhys(selectedPhys)}
      />

      <EvremapGUIComp
        dualRoleEntries={entries.dualRoleEntries}
        setDualRoleEntries={(newEntries) =>
          setEntries({ ...entries, dualRoleEntries: newEntries })
        }
      />

      <RemapSection
        remapEntries={entries.remapEntries}
        setRemapEntries={(newEntries) =>
          setEntries({ ...entries, remapEntries: newEntries })
        }
      />

      <TOMLPreview
        dualRoleEntries={entries.dualRoleEntries}
        remapEntries={entries.remapEntries}
        deviceName={deviceName}
        selectedPhys={selectedPhys}
      />
    </div>
  );
}

export default App;
