
import { useEffect, useRef } from 'react';
import { usePaintContext } from '../contexts/PaintContext';

export const useGestureDetection = (poses) => {
  const { state, dispatch } = usePaintContext();
  const lastGesture = useRef(null);
  const gestureTimeout = useRef(null);

  const detectGesture = (pose) => {
    if (!pose?.keypoints) return null;

    const leftWrist = pose.keypoints.find(kp => kp.part === 'leftWrist');
    const rightWrist = pose.keypoints.find(kp => kp.part === 'rightWrist');
    const nose = pose.keypoints.find(kp => kp.part === 'nose');

    // Both hands above head = clear canvas
    if (leftWrist?.position.y < nose?.position.y - 100 && 
        rightWrist?.position.y < nose?.position.y - 100) {
      return 'CLEAR_CANVAS';
    }

    // Right hand far right = toggle camera
    if (rightWrist?.position.x > nose?.position.x + 200) {
      return 'TOGGLE_CAMERA';
    }

    // Left hand far left = undo
    if (leftWrist?.position.x < nose?.position.x - 200) {
      return 'UNDO';
    }

    return null;
  };

  useEffect(() => {
    if (!state.tracking.gestureMode || !poses.length) return;

    const gesture = detectGesture(poses[0]);
    if (gesture && gesture !== lastGesture.current) {
      lastGesture.current = gesture;
      
      // Clear timeout if it exists
      if (gestureTimeout.current) {
        clearTimeout(gestureTimeout.current);
      }

      // Execute gesture action
      switch (gesture) {
        case 'CLEAR_CANVAS':
          dispatch({ type: 'UPDATE_CANVAS', payload: { clear: true } });
          break;
        case 'TOGGLE_CAMERA':
          dispatch({ type: 'UPDATE_UI', payload: { cameraEnabled: !state.ui.cameraEnabled } });
          break;
        case 'UNDO':
          if (state.canvas.currentHistoryIndex > 0) {
            dispatch({ 
              type: 'UPDATE_CANVAS', 
              payload: { currentHistoryIndex: state.canvas.currentHistoryIndex - 1 } 
            });
          }
          break;
      }

      // Reset gesture after delay
      gestureTimeout.current = setTimeout(() => {
        lastGesture.current = null;
      }, 1000);
    }
  }, [dispatch, poses, state.canvas.currentHistoryIndex, state.tracking.gestureMode, state.ui.cameraEnabled]);
};