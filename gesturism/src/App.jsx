/* eslint-disable no-unused-vars */
import React from 'react';
import { PaintProvider } from './components/Contexts/PaintContext';
import Canvas from './components/Canvas/Canvas';
import Settings from './components/Settings/Settings';
import Camera from './components/Camera/Camera';

const App = () => {
  return (
    <PaintProvider>
      <div className="flex h-screen">
        <div className="flex-1 relative">
          <Canvas />
        </div>
        <div className="w-64">
          <Settings />
        </div>
      </div>
    </PaintProvider>
  );
};

export default App;
