/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// Global state management for active brush settings, tracking selections, color settings and canvas state
// - Tracking settings (e.g., whether tracking is enabled, gesture mode, etc.)
// - Tool settings (e.g., brush type, size, color, opacity)
// - Canvas settings (e.g., width, height, undo/redo history)
// - UI settings (e.g., whether the settings panel is visible, camera enabled)
import React, { createContext, useContext, useReducer } from 'react';

const PaintContext = createContext();

const initialState = {
    // Tracking settings
    tracking: {
      isTracking: true,
      speedThreshold: 5, // for movement speed detection
      lastPositions: [], // for path tracking
      gestureMode: false,
    },
    // Tool settings
    tools: {
      currentTool: 'brush',
      brushType: 'basic',
      brushSize: 5,
      opacity: 1,
      color: '#000000',
    },
    // Canvas settings
    canvas: {
      width: 800,
      height: 600,
      history: [], // for undo/redo
      currentHistoryIndex: -1,
      unsavedChanges: false,
    },
    // UI settings
    ui: {
      showSettings: false,
      showColorPicker: false,
      cameraEnabled: true,
    }
  };


  const paintReducer = (state, action) => {
    switch (action.type) {
      case 'SET_TOOL':
        return { ...state, tools: { ...state.tools, ...action.payload } };
      case 'UPDATE_TRACKING':
        return { ...state, tracking: { ...state.tracking, ...action.payload } };
      case 'UPDATE_CANVAS':
        return { ...state, canvas: { ...state.canvas, ...action.payload } };
      case 'UPDATE_UI':
        return { ...state, ui: { ...state.ui, ...action.payload } };
      case 'ADD_TO_HISTORY':
        return {
          ...state,
          canvas: {
            ...state.canvas,
            history: [...state.canvas.history.slice(0, state.canvas.currentHistoryIndex + 1), action.payload],
            currentHistoryIndex: state.canvas.currentHistoryIndex + 1,
            unsavedChanges: true,
          }
        };
      default:
        return state;
    }
  };

  export const PaintProvider = ({ children }) => {
    const [state, dispatch] = useReducer(paintReducer, initialState);
  
    return (
      <PaintContext.Provider value={{ state, dispatch }}>
        {children}
      </PaintContext.Provider>
    );
  };
  

export const usePaintContext= () => useContext(PaintContext);