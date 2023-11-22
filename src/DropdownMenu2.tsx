// DropdownMenu2.tsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { invoke } from "@tauri-apps/api/tauri";
import './DropdownMenu2.css';

interface DropdownMenu2Props {
  setDeviceName: (deviceName: string) => void;
  setSelectedPhys: (selectedPhys: string) => void;
}

const DropdownMenu2: React.FC<DropdownMenu2Props> = ({ setDeviceName, setSelectedPhys }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [showSecondDropdown, setShowSecondDropdown] = useState(false);
  const [secondDropdownOptions, setSecondDropdownOptions] = useState<string[]>([]);
  const [selectedPhys, setSelectedPhysInternal] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await invoke("get_device_names");
        const optionsArray = data.split('\n').filter(Boolean);
        setOptions(optionsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowSecondDropdown(e.target.checked);
    if (!e.target.checked) {
      // Reset selectedPhys when checkbox is unchecked
      setSelectedPhysInternal(null);
      setSelectedPhys(null); // Ensure that the parent component's state is also updated
    }
  };
  

  useEffect(() => {
    const fetchPhysData = async () => {
      try {
        const data = await invoke("get_phys_names");
        const optionsArray = data.split('\n').filter(Boolean);
        setSecondDropdownOptions(optionsArray);
      } catch (error) {
        console.error("Error fetching data for second dropdown:", error);
      }
    }

    if (showSecondDropdown) {
      fetchPhysData();
    }
  }, [showSecondDropdown]);

  const handlePhysChange = (selectedOption: any) => {
    const physValue = selectedOption?.value || null;
    setSelectedPhysInternal(physValue);
    setSelectedPhys(physValue); // Ensure that the parent component's state is also updated
  };
  
  const customStyles2 = {
    control: (provided) => ({
      ...provided,
      color: 'black',
      width: 350, // Set the width as needed
      margin: '0 auto',
      position: 'relative',
    }),
    option: (provided) => ({
      ...provided,
      color: 'black',
      width: 350, // Set the width as needed
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      width: 350, // Set the width of the expanded menu as needed
      position: 'absolute',
      top: '100%', // Position the dropdown below the control
      left: '50%', // Center the dropdown horizontally relative to the control
      transform: 'translateX(-50%)', // Adjust for horizontal centering
      zIndex: 1,
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: 350, // Set the maximum height of the list as needed
      overflow: 'auto', // Enable vertical scrolling if the list exceeds maxHeight
    }),
  };

  return (
    <div>
      <label htmlFor="deviceSelect">Device name</label>
      {options.length > 0 && (
        <Select
          id="deviceSelect"
          options={options.map(option => ({ label: option, value: option }))}
          styles={customStyles2}
          onChange={(selectedOption) => setDeviceName(selectedOption?.value || "")}
        />
      )}

      <div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showSecondDropdown}
            onChange={handleCheckboxChange}
          />
          <span className="checkmark"></span>
          Optional physical address
        </label>

        {showSecondDropdown && (
          <Select
            options={secondDropdownOptions.map(option => ({ label: option, value: option }))}
            styles={customStyles2}
            onChange={handlePhysChange}
          />
        )}
      </div>
    </div>
  );
};

export default DropdownMenu2;
