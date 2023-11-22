import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { save } from '@tauri-apps/api/dialog';
// or
//import { dialog } from '@tauri-apps/api/tauri';

interface DualRoleEntry {
  input: string[];
  hold: string[];
  tap: string[];
}

interface RemapEntry {
  input: string[];
  output: string[];
}

interface TOMLPreviewProps {
  dualRoleEntries: DualRoleEntry[];
  remapEntries: RemapEntry[];
  deviceName: string;
  selectedPhys: string | null;
}

const TOMLPreview: React.FC<TOMLPreviewProps> = ({ dualRoleEntries, remapEntries, deviceName, selectedPhys }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");

  const generateTOMLString = (entries: DualRoleEntry[]) => {
    const tomlSections = entries.map((entry) => {
      const inputSection =
        entry.input.length === 1
          ? `input = "${entry.input[0]}"`
          : entry.input.length > 0
          ? `input = ${JSON.stringify(entry.input)}`
          : '';

      const holdSection = entry.hold.length > 0 ? `hold = ${JSON.stringify(entry.hold)}` : '';
      const tapSection = entry.tap.length > 0 ? `tap = ${JSON.stringify(entry.tap)}` : '';

      return `[[dual_role]]\n${inputSection}\n${holdSection}\n${tapSection}`;
    });

    const tomlPreview = tomlSections.join('\n');

    const deviceSection = deviceName ? `device_name = "${deviceName}"` : '';
    const physSection = selectedPhys !== null ? `phys = "${selectedPhys}"` : '';

    const fullTOMLPreview = `${deviceSection}\n${physSection}\n${tomlPreview}`;

    return fullTOMLPreview;
  };

  const generateRemapTOML = (entries: RemapEntry[]) => {
    const remapSections = entries.map((entry) => {
      const inputSection = entry.input.length > 0 ? `input = ${JSON.stringify(entry.input)}` : '';
      const outputSection = entry.output.length > 0 ? `output = ${JSON.stringify(entry.output)}` : '';

      return `[[remap]]\n${inputSection}\n${outputSection}`;
    });

    return remapSections.join('\n') + '\n';
  };

  const handleCopyClick = () => {
    const tomlPreview = generateTOMLString(dualRoleEntries);
    const remapTOMLPreview = generateRemapTOML(remapEntries);

    const combinedPreview = `${tomlPreview}\n${remapTOMLPreview}`;

    const textArea = document.createElement('textarea');
    textArea.value = combinedPreview;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSaveToFile = async () => {
    const tomlPreview = generateTOMLString(dualRoleEntries);
    const remapTOMLPreview = generateRemapTOML(remapEntries);
    const combinedPreview = `${tomlPreview}\n${remapTOMLPreview}`;

    try {
      await invoke('update_toml_content', { content: combinedPreview, filePath });
      setSaved(true);

      // Log to the console
      console.log(`File Name: ${fileName}`);
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

/*  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
  
    if (selectedFile) {
      const fullPath = selectedFile.webkitRelativePath || selectedFile.path || selectedFile.name;
      setFileName(fullPath);<input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Enter file path" />
  }; */
  
  const handleBrowseFile = async () => {
    try {
      const result = await save();
  
      if (result) {
        setFilePath(result);
        setFileName(result.split('/').pop() || '');
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <h3>File preview</h3>
      

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
      <button onClick={handleCopyClick} style={{ marginRight: '200px' }}>Copy to Clipboard</button>
      <button onClick={handleBrowseFile} style={{ verticalAlign: 'middle' }}>Browse</button>
      <input
  type="text"
  value={filePath}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilePath(e.target.value)}
  placeholder="Enter file path"
  style={{ verticalAlign: 'middle' }}
/>
      <button onClick={handleSaveToFile} style={{ verticalAlign: 'middle' }}>Save to File</button>
      {copied && <span style={{ verticalAlign: 'middle' }}>Copied!</span>}
      {saved && <span style={{ verticalAlign: 'middle' }}>Saved!</span>}
    </div>
      <pre style={{ backgroundColor: '#7d7878', padding: '10px', borderRadius: '5px', marginTop: '10px', textAlign: 'left', fontSize: '12px', color: 'black' }}>
        {deviceName && <div><span style={{ color: '#522337' }}>device_name</span> = <span style={{ color: 'yellow' }}>"{deviceName}"</span></div>}
        {selectedPhys !== null && <div><span style={{ color: '#522337' }}>phys</span> = <span style={{ color: 'yellow' }}>"{selectedPhys}"</span></div>}
        {dualRoleEntries.map((entry, index) => (
          <div key={index}>
            <span style={{ color: '#235232' }}>{'[[dual_role]]'}</span>
            {entry.input.length > 0 && <div><span style={{ color: '#522337' }}>input</span> = {entry.input.length === 1 ? <span style={{ color: 'yellow' }}>"{entry.input[0]}"</span> : <span style={{ color: 'yellow' }}>{JSON.stringify(entry.input)}</span>}</div>}
            {entry.hold.length > 0 && <div><span style={{ color: '#522337' }}>hold</span> = <span style={{ color: 'yellow' }}>{JSON.stringify(entry.hold)}</span></div>}
            {entry.tap.length > 0 && <div><span style={{ color: '#522337' }}>tap</span> = <span style={{ color: 'yellow' }}>{JSON.stringify(entry.tap)}</span></div>}
          </div>
        ))}
        {remapEntries.map((entry, index) => (
          <div key={index}>
            <span style={{ color: '#235232' }}>{'[[remap]]'}</span>
            {entry.input.length > 0 && <div><span style={{ color: '#522337' }}>input</span> = <span style={{ color: 'yellow' }}>{JSON.stringify(entry.input)}</span></div>}
            {entry.output.length > 0 && <div><span style={{ color: '#522337' }}>output</span> = <span style={{ color: 'yellow' }}>{JSON.stringify(entry.output)}</span></div>}
          </div>
        ))}
      </pre>
    </div>
  );
};

export default TOMLPreview;
