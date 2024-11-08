/* eslint-disable no-unused-vars */
/*
The `Settings` component provides the UI for controlling the various settings, including:
- Tracking settings (enable/disable, gesture mode)
- Brush settings (type, size, opacity, color)
- Canvas controls (clear, undo, redo)
 */
import React from 'react';
import { usePaintContext } from '../Contexts/PaintContext';

const Settings = () => {
  const { state, dispatch } = usePaintContext();

  return (
    <div className="bg-white p-4 shadow-lg w-64">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      
      {/* Tracking Controls */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Tracking</h3>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={state.tracking.isTracking}
            onChange={(e) => dispatch({
              type: 'UPDATE_TRACKING',
              payload: { isTracking: e.target.checked }
            })}
            className="mr-2"
          />
          Enable Tracking
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={state.tracking.gestureMode}
            onChange={(e) => dispatch({
              type: 'UPDATE_TRACKING',
              payload: { gestureMode: e.target.checked }
            })}
            className="mr-2"
          />
          Gesture Controls
        </label>
      </div>

      {/* Brush Settings */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Brush</h3>
        <select
          value={state.tools.brushType}
          onChange={(e) => dispatch({
            type: 'SET_TOOL',
            payload: { brushType: e.target.value }
          })}
          className="w-full mb-2 p-1 border rounded"
        >
          <option value="basic">Basic</option>
          <option value="spray">Spray</option>
          <option value="calligraphy">Calligraphy</option>
        </select>
        
        <label className="block mb-2">
          Size:
          <input
            type="range"
            min="1"
            max="50"
            value={state.tools.brushSize}
            onChange={(e) => dispatch({
              type: 'SET_TOOL',
              payload: { brushSize: parseInt(e.target.value) }
            })}
            className="w-full"
          />
        </label>

        <label className="block mb-2">
          Opacity:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={state.tools.opacity}
            onChange={(e) => dispatch({
              type: 'SET_TOOL',
              payload: { opacity: parseFloat(e.target.value) }
            })}
            className="w-full"
          />
        </label>

        <label className="block">
          Color:
          <input
            type="color"
            value={state.tools.color}
            onChange={(e) => dispatch({
              type: 'SET_TOOL',
              payload: { color: e.target.value }
            })}
            className="w-full"
          />
        </label>
      </div>

      {/* Canvas Controls */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Canvas</h3>
        <button
          onClick={() => dispatch({
            type: 'UPDATE_CANVAS',
            payload: { clear: true }
          })}
          className="w-full bg-red-500 text-white py-1 px-2 rounded mb-2"
        >
          Clear Canvas
        </button>
        <button
          disabled={state.canvas.currentHistoryIndex <= 0}
          onClick={() => dispatch({
            type: 'UPDATE_CANVAS',
            payload: { currentHistoryIndex: state.canvas.currentHistoryIndex - 1 }
          })}
          className="w-full bg-blue-500 text-white py-1 px-2 rounded mb-2"
        >
          Undo
        </button>
        <button
          disabled={state.canvas.currentHistoryIndex >= state.canvas.history.length - 1}
          onClick={() => dispatch({
            type: 'UPDATE_CANVAS',
            payload: { currentHistoryIndex: state.canvas.currentHistoryIndex + 1 }
          })}
          className="w-full bg-blue-500 text-white py-1 px-2 rounded"
        >
          Redo
        </button>
      </div>
    </div>
  );
};

export default Settings;