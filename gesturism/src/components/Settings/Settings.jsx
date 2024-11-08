/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
//Main settings panel container
import React from 'react';
import { usePaintContext } from '../../contexts/PaintContext';

const Settings = () => {
  const { settings, setSettings } = usePaintContext();

  const updateTracking = (bodyPart, field, value) => {
    setSettings(prev => ({
      ...prev,
      tracking: {
        ...prev.tracking,
        [bodyPart]: {
          ...prev.tracking[bodyPart],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="bg-purple-900 p-4 text-white">
      <h2 className="text-xl mb-4">Settings</h2>
      {Object.entries(settings.tracking).map(([bodyPart, config]) => (
        <div key={bodyPart} className="mb-2">
          <div className="flex items-center gap-2">
            <label>{bodyPart}</label>
            <select
              value={config.brush}
              onChange={(e) => updateTracking(bodyPart, 'brush', e.target.value)}
              className="text-black"
            >
              <option value="none">None</option>
              <option value="pencil">Pencil</option>
              <option value="fine-line">Fine Line</option>
              <option value="wet-acrylics">Wet Acrylics</option>
            </select>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => updateTracking(bodyPart, 'enabled', e.target.checked)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};