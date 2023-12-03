// RemapSection.tsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { invoke } from '@tauri-apps/api/tauri';

interface RemapEntry {
  input: string[];
  output: string[];
}

interface RemapSectionProps {
  remapEntries: RemapEntry[];
  setRemapEntries: React.Dispatch<React.SetStateAction<RemapEntry[]>>;
}

const RemapSection: React.FC<RemapSectionProps> = (props) => {
  const { remapEntries, setRemapEntries } = props;
  const [keys, setKeys] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const keysResponse = await invoke('list_keys');
        const keysArray = keysResponse.split('\n').filter(Boolean);
        setKeys(keysArray);
      } catch (error) {
        console.error('Error fetching keys:', error);
      }
    };

    fetchKeys();
  }, []);

  const handleAddRemapEntry = () => {
    setRemapEntries([...remapEntries, { input: [], output: [] }]);
  };

  const handleInputChange = (index: number, type: 'input' | 'output', selectedOptions: any[]) => {
    const updatedEntries = [...remapEntries];
    updatedEntries[index][type] = selectedOptions.map((option) => option.value);
    setRemapEntries(updatedEntries);
    setError(null); // Clear error when making changes
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const updatedEntries = [...remapEntries];
      const temp = updatedEntries[index];
      updatedEntries[index] = updatedEntries[index - 1];
      updatedEntries[index - 1] = temp;
      setRemapEntries(updatedEntries);
      setError(null); // Clear error when making changes
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < remapEntries.length - 1) {
      const updatedEntries = [...remapEntries];
      const temp = updatedEntries[index];
      updatedEntries[index] = updatedEntries[index + 1];
      updatedEntries[index + 1] = temp;
      setRemapEntries(updatedEntries);
      setError(null); // Clear error when making changes
    }
  };

  const handleRemoveEntry = (index: number) => {
    const updatedEntries = [...remapEntries];
    updatedEntries.splice(index, 1);
    setRemapEntries(updatedEntries);
    setError(null); // Clear error when making changes
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      color: 'black',
      width: 250, // Set the width as needed
    }),
    option: (provided: any) => ({
      ...provided,
      color: 'black',
      width: 200, // Set the width as needed
    }),
    menu: (provided: any) => ({
      ...provided,
      width: 200, // Set the width of the expanded menu as needed
    }),
  };

  return (
    <div>
      <div>
        <h3>[[remap]]</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div style={{ marginRight: '20px', width: '260px' }}>
            <label style={{ display: 'inline-block', marginRight: '5px' }}>Input:</label>
          </div>
          <div style={{ marginRight: '20px', width: '260px' }}>
            <label style={{ display: 'inline-block', marginRight: '5px' }}>Output:</label>
          </div>
        </div>
        {remapEntries && remapEntries.map((entry, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ marginRight: '20px', width: '260px' }}>
              <Select
                isMulti
                options={keys.map((key) => ({ label: key, value: key }))}
                value={entry.input && entry.input.map((value) => ({ label: value, value }))}
                onChange={(selectedOptions) => handleInputChange(index, 'input', selectedOptions)}
                styles={customStyles}
              />
            </div>
            <div style={{ marginRight: '20px', width: '260px' }}>
              <Select
                isMulti
                options={keys.map((key) => ({ label: key, value: key }))}
                value={entry.output && entry.output.map((value) => ({ label: value, value }))}
                onChange={(selectedOptions) => handleInputChange(index, 'output', selectedOptions)}
                styles={customStyles}
              />
            </div>
            <button onClick={() => handleMoveUp(index)}>Move Up</button>
            <button onClick={() => handleMoveDown(index)}>Move Down</button>
            <button onClick={() => handleRemoveEntry(index)}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddRemapEntry}>Add [[remap]]</button>
      </div>
    </div>
  );
};

export default RemapSection;
