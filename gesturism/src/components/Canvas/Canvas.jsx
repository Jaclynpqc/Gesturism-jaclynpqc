/* eslint-disable no-unused-vars */
import React, { useRef, useEffect } from 'react';
import { usePaintContext } from '../Contexts/PaintContext';
import { usePoseDetection } from '../PoseDetection/PoseDetection';
const Canvas = () => {
  const canvasRef = useRef(null);
  const { state } = usePaintContext();
  const { poses, detectPose } = usePoseDetection();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (state.tracking.isTracking && poses.length) {
        const pose = poses[0];
        pose.keypoints.forEach(keypoint => {
          if (keypoint.score > 0.5) {
            const { x, y } = keypoint.position;
            ctx.beginPath();
            ctx.globalAlpha = state.tools.opacity;
            ctx.strokeStyle = state.tools.color;
            ctx.lineWidth = state.tools.brushSize;
            ctx.moveTo(x, y);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        });
      }

      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  }, [state.tracking.isTracking, poses, state.tools]);

  useEffect(() => {
    const interval = setInterval(() => {
      detectPose();
    }, 100);

    return () => clearInterval(interval);
  }, [detectPose]);

  return (
    <canvas
      ref={canvasRef}
      width={state.canvas.width}
      height={state.canvas.height}
      className="border border-gray-300 w-full h-full"
    />
  );
};

export default Canvas;