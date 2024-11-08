/* eslint-disable no-unused-vars */
//Video feed component showing users movement
/*
1. Requesting access to the user's camera when the `cameraEnabled` state is true.
2. Stopping the camera when the `cameraEnabled` state is false.
3. Continuously calling the `detectPose` function from the `useGestureDetection` hook to update the pose data.
4. Rendering the camera video feed as a full-screen background.
 */
import React, { useRef, useEffect } from 'react';
import { usePaintContext } from '../Contexts/PaintContext';
import { useGestureDetection } from '../../hooks/useGestureDetection';

const Camera = () => {
  const videoRef = useRef(null);
  const { state, dispatch } = usePaintContext();
  //const { poses, detectPose } = useGestureDetection(videoRef);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        dispatch({ type: 'UPDATE_UI', payload: { cameraEnabled: false } });
      }
    };

    if (state.ui.cameraEnabled) {
      getCamera();
    } else {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.srcObject?.getTracks().forEach((track) => track.stop());
      }
    }
  }, [state.ui.cameraEnabled, dispatch]);

  /* Remove the Gesture Detection Now since it's causing the fail
  useEffect(() => {
    if (state.ui.cameraEnabled) {
      const interval = setInterval(() => {
        detectPose();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [state.ui.cameraEnabled, detectPose]);
  */

  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
      {state.ui.cameraEnabled && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default Camera;