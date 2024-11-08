/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// Main drawing surface that renders the brush strokes based on pose keypoints
import React, { useRef, useEffect } from 'react';
import { usePaintContext } from '../../contexts/PaintContext';

const Canvas = ({ poses }) => {
  const canvasRef = useRef(null);
  const { settings } = usePaintContext();

  useEffect(() => {
    if (!poses.length) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const pose = poses[0];

    // Draw based on keypoints
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.5) {
        const { x, y } = keypoint.position;
        // Apply brush based on body part
        drawStroke(ctx, x, y, settings.tracking[getBodyPart(keypoint.part)]);
      }
    });
  }, [poses, settings]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute top-0 left-0"
      width={640}
      height={480}
    />
  );
};