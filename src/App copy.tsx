import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
//import DropdownMenu2 from "./DropdownMenu2";
//import RemapsComponent3 from "./RemapsComponent3";
import EvremapGUIComp from "./EvremapGUIComp3";
import RemapSection from "./RemapSection";
import TOMLPreview from "./TOMLPreview";

//import DeviceConfigComponent from './DeviceConfigComponent';
//import saveToDeviceConfig from './saveToDeviceConfig';


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [Ypt, setYpt] = useState("");
  const [name, setName] = useState("");

  const [dualRoleEntries, setDualRoleEntries] = useState<DualRoleEntry[]>([{ input: [], hold: [], tap: [] }]);
  const [remapEntries, setRemapEntries] = useState<RemapEntry[]>([{ input: [], output: [] }]);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
    //setYpt(await invoke("get_device_names"));
  }
  
   
  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
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

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

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

      <EvremapGUIComp
        dualRoleEntries={dualRoleEntries}
        setDualRoleEntries={setDualRoleEntries}
        remapEntries={remapEntries}
        setRemapEntries={setRemapEntries}
      />

      <RemapSection remapEntries={remapEntries} setRemapEntries={setRemapEntries} />

      <TOMLPreview dualRoleEntries={dualRoleEntries} remapEntries={remapEntries} />

      
      
           

          </div>
 

  );
}

export default App;
