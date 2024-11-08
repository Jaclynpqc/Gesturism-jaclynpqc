/* eslint-disable no-unused-vars */
// Handle PoseNet setup, video processing, and pose detection
import * as posenet from "@tensorflow-models/posenet";
import { flipPoseHorizontal } from "@tensorflow-models/posenet/dist/util";
import {useEffect, useRef, useState} from 'react';


export const usePoseDetection = (videoRef) => {
    const [poses, setPoses] = useState([]);
    const net = useRef(null);
  
    useEffect(() => {
      const loadPoseNet = async () => {
        net.current = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75
        });
      };
      loadPoseNet();
    }, []);
  
    const detectPose = async () => {
      if (!net.current || !videoRef.current) return;
      
      const pose = await net.current.estimateSinglePose(videoRef.current, {
        flipHorizontal: true
      });
      setPoses([pose]);
      return pose;
    };
  
    return { poses, detectPose };
  };