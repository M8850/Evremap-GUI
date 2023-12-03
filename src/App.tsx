// App.tsx
import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import DeviceNamePhys from "./DeviceNamePhys";
import DualroleSection from "./DualroleSection";
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
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [selectedPhys, setSelectedPhys] = useState<string | null>(null);
  const [dualRoleEntries, setDualRoleEntries] = useState<DualRoleEntry[]>([{ input: [], hold: [], tap: [] }]);
  const [remapEntries, setRemapEntries] = useState<RemapEntry[]>([{ input: [], output: [] }]);

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

      
      <DeviceNamePhys
        setDeviceName={(deviceName) => setDeviceName(deviceName)}
        setSelectedPhys={(selectedPhys) => setSelectedPhys(selectedPhys)}
      />

      <DualroleSection
        dualRoleEntries={dualRoleEntries}
        setDualRoleEntries={setDualRoleEntries}
      />

      <RemapSection
        remapEntries={remapEntries}
        setRemapEntries={setRemapEntries}
      />

      <TOMLPreview
        dualRoleEntries={dualRoleEntries}
        remapEntries={remapEntries}
        deviceName={deviceName}
        selectedPhys={selectedPhys}
        setDualRoleEntries={setDualRoleEntries}
        setRemapEntries={setRemapEntries}
        setDeviceName={(deviceName) => setDeviceName(deviceName)}
        setSelectedPhys={(selectedPhys) => setSelectedPhys(selectedPhys)}
      />
    </div>
  );
}

export default App;
