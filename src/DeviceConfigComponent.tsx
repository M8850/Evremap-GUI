// DeviceConfigComponent.tsx

import React, { useState } from 'react';

const DeviceConfigComponent: React.FC<{ onSave: (deviceName: string) => void }> = ({ onSave }) => {
    const [selectedDevice, setSelectedDevice] = useState<string>('');
  
    const [deviceNames, setDeviceNames] = useState<string[]>([]);
    useEffect(() => {
      window.__TAURI__.invoke('get_device_names')
        .then(setDeviceNames)
        .catch(error => console.error(error));
    }, []);
  
    const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedDevice(event.target.value);
    };

  const handleSave = async () => {
    try {
      await window.__TAURI__.invoke('save_device_to_config', selectedDevice);
      alert('Device name saved to config file!');
    } catch (error) {
      console.error(error);
      alert('Error saving device name to config file');
    }
  };
  
  

  return (
    <div>
      <label>
  Select Device:
  <select value={selectedDevice} onChange={handleDeviceChange}>
    {deviceNames.map((deviceName, index) => (
      <option key={index} value={deviceName}>
        {deviceName}
      </option>
    ))}
  </select>
</label>

      <button onClick={handleSave}>Save to File</button>
    </div>
  );
};

export default DeviceConfigComponent;
