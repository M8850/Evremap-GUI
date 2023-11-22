// RemapSection.tsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { invoke } from '@tauri-apps/api/tauri';
//import TOMLPreview from './TOMLPreview';

interface RemapEntry {
  input: string[];
  output: string[];
}

interface RemapSectionProps {
  remapEntries: RemapEntry[];
  setRemapEntries: React.Dispatch<React.SetStateAction<RemapEntry[]>>;
}

const RemapSection: React.FC<RemapSectionProps> = (props) => {
  const [keys, setKeys] = useState<string[]>([]);

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
    props.setRemapEntries([...props.remapEntries, { input: [], output: [] }]);
  };

  const handleInputChange = (index: number, type: 'input' | 'output', selectedOptions: any[]) => {
    const updatedEntries = [...props.remapEntries];
    updatedEntries[index][type] = selectedOptions.map((option) => option.value);
    props.setRemapEntries(updatedEntries);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const updatedEntries = [...props.remapEntries];
      const temp = updatedEntries[index - 1];
      updatedEntries[index - 1] = updatedEntries[index];
      updatedEntries[index] = temp;
      props.setRemapEntries(updatedEntries);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < props.remapEntries.length - 1) {
      const updatedEntries = [...props.remapEntries];
      const temp = updatedEntries[index + 1];
      updatedEntries[index + 1] = updatedEntries[index];
      updatedEntries[index] = temp;
      props.setRemapEntries(updatedEntries);
    }
  };

  const handleRemove = (index: number) => {
    const updatedEntries = [...props.remapEntries];
    updatedEntries.splice(index, 1);
    props.setRemapEntries(updatedEntries);
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
    <h3>[[remap]]</h3>
    <div style={{ display: 'flex', marginBottom: '10px' }}>
      <div style={{ marginRight: '20px', width: '260px' }}>
        <label style={{ display: 'inline-block', marginRight: '5px' }}>Input:</label>
      </div>
      <div style={{ marginRight: '20px', width: '260px' }}>
        <label style={{ display: 'inline-block', marginRight: '5px' }}>Output:</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '80px' }}></div>
        <div style={{ width: '80px' }}></div>
        <div style={{ width: '80px' }}></div>
      </div>
    </div>
    {props.remapEntries.map((entry, index) => (
      <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ marginRight: '20px', width: '260px' }}>
          <Select
            isMulti
            options={keys.map((key) => ({ label: key, value: key }))}
            value={entry.input.map((value) => ({ label: value, value }))}
            onChange={(selectedOptions) => handleInputChange(index, 'input', selectedOptions)}
            styles={customStyles}
          />
        </div>
        <div style={{ marginRight: '20px', width: '260px' }}>
          <Select
            isMulti
            options={keys.map((key) => ({ label: key, value: key }))}
            value={entry.output.map((value) => ({ label: value, value }))}
            onChange={(selectedOptions) => handleInputChange(index, 'output', selectedOptions)}
            styles={customStyles}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button style={{ marginRight: '5px' }} onClick={() => handleMoveUp(index)}>
            Move Up
          </button>
          <button style={{ marginRight: '5px' }} onClick={() => handleMoveDown(index)}>
            Move Down
          </button>
          <button onClick={() => handleRemove(index)}>Remove</button>
        </div>
      </div>
    ))}
    <button onClick={handleAddRemapEntry}>Add [[remap]]</button>
    
  </div>
  );
};

export default RemapSection;
