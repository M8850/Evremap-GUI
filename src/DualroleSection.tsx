// DualroleSection.tsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { invoke } from '@tauri-apps/api/tauri';

interface DualRoleEntry {
  input: string[];
  hold: string[];
  tap: string[];
}

interface DualroleSectionProps {
  dualRoleEntries: DualRoleEntry[];
  setDualRoleEntries: React.Dispatch<React.SetStateAction<DualRoleEntry[]>>;
}

const DualroleSection: React.FC<DualroleSectionProps> = (props) => {
  const { dualRoleEntries, setDualRoleEntries } = props;
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

  const handleAddDualRoleEntry = () => {
    setDualRoleEntries([...dualRoleEntries, { input: [], hold: [], tap: [] }]);
  };

  const handleInputChange = (index: number, type: 'input' | 'hold' | 'tap', selectedOptions: any[]) => {
    const updatedEntries = [...dualRoleEntries];
    updatedEntries[index][type] = selectedOptions.map((option) => option.value);
    setDualRoleEntries(updatedEntries);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const updatedEntries = [...dualRoleEntries];
      const temp = updatedEntries[index];
      updatedEntries[index] = updatedEntries[index - 1];
      updatedEntries[index - 1] = temp;
      setDualRoleEntries(updatedEntries);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < dualRoleEntries.length - 1) {
      const updatedEntries = [...dualRoleEntries];
      const temp = updatedEntries[index];
      updatedEntries[index] = updatedEntries[index + 1];
      updatedEntries[index + 1] = temp;
      setDualRoleEntries(updatedEntries);
    }
  };

  const handleRemoveEntry = (index: number) => {
    const updatedEntries = [...dualRoleEntries];
    updatedEntries.splice(index, 1);
    setDualRoleEntries(updatedEntries);
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
        <h3>[[dual_role]]</h3>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div style={{ marginRight: '20px', width: '260px' }}>
            <label style={{ display: 'inline-block', marginRight: '5px' }}>Input:</label>
          </div>
          <div style={{ marginRight: '20px', width: '260px' }}>
            <label style={{ display: 'inline-block', marginRight: '5px' }}>Hold:</label>
          </div>
          <div style={{ marginRight: '20px', width: '260px' }}>
            <label style={{ display: 'inline-block', marginRight: '5px' }}>Tap:</label>
          </div>
        </div>
        {dualRoleEntries && dualRoleEntries.map((entry, index) => (
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
                value={entry.hold && entry.hold.map((value) => ({ label: value, value }))}
                onChange={(selectedOptions) => handleInputChange(index, 'hold', selectedOptions)}
                styles={customStyles}
              />
            </div>
            <div style={{ marginRight: '20px', width: '260px' }}>
              <Select
                isMulti
                options={keys.map((key) => ({ label: key, value: key }))}
                value={entry.tap && entry.tap.map((value) => ({ label: value, value }))}
                onChange={(selectedOptions) => handleInputChange(index, 'tap', selectedOptions)}
                styles={customStyles}
              />
            </div>
            <button onClick={() => handleMoveUp(index)}>Move Up</button>
            <button onClick={() => handleMoveDown(index)}>Move Down</button>
            <button onClick={() => handleRemoveEntry(index)}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddDualRoleEntry}>Add [[dual_role]]</button>
      </div>
    </div>
  );
};

export default DualroleSection;
