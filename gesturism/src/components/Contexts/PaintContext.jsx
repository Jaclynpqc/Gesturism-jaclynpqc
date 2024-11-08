/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// Global state management for active brush settings, tracking selections, color settings and canvas state
import React, { createContext, useContext, useState } from 'react';

const PaintContext = createContext();

export const PaintProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    tracking: {
      head: { brush: 'pencil', enabled: true },
      upperBody: { brush: 'fine-line', enabled: true },
      lowerBody: { brush: 'wet-acrylics', enabled: true },
      arms: { brush: 'pencil', enabled: true },
      hands: { brush: 'none', enabled: false },
    },
    colors: {
      head: '#000000',
      upperBody: '#0000FF',
      lowerBody: '#FF0000',
      arms: '#00FF00',
    }
  });

  return (
    <PaintContext.Provider value={{ settings, setSettings }}>
      {children}
    </PaintContext.Provider>
  );
};

export const usePaintContext = () => useContext(PaintContext);
