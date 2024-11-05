/* eslint-disable no-unused-vars */
/* Utilities to perform real-time human pose estimation.
This code refers to several functionality using posenet. Including drawing keypoints, skeletons, bounding boxes, maps.
This code is a result from reading this article(https://blog.tensorflow.org/2018/05/real-time-human-pose-estimation-in.html)*/

/* PoseNet can be used to estimate either a single pose or multiple poses, however there are some tradeoffs to consider. The single person pose detection is faster but requires only one subject present in the image. 
For the purpose of this MVP, I'll integrate the single person mode first. Mutiple poses will be integrated in the next part of the project. */

/* Important notes about Posenet: 
- Pose: return a pose object that contains a list of keypoints and an instance level confidence score for each detected person
- Pose confidence score: determines the overall confidence in the estimation of a pose. It ranges between 0.0 and 1.0. It can be used to hide poses that are not deemed strong enough
- Keypoint a part of a person's pose that is estimated, such as the nose, right ear, left knee, right foot, etc.
- Keypoint Confidence Score: this determines the confidence that an estimated keypoint position is accurate, between 0.0 and 1,0.
- Keypoint POsition: 2D x and y coordintaes in the original input image where a keypoint has been detected
One important detail to note is that the researchers trained both a ResNet and a MobileNet model of PoseNet.
While the ResNet model has a higher accuracy, its large size and many layers would make the page load time and inference time less-than-ideal for any real-time applications. */

//Import modules
//PoseNet:https://github.com/google-coral/project-posenet
//TensorFlow.js: https://www.npmjs.com/package/@tensorflow/tfjs
import * as posenet from '@tensorflow-models/posenet';
import * as tf from "@tensorflow/tfjs";
const net = await posenet.load();

/* Inputs for the single-pose estimation algorithm:
- Input image element: An html element that contains an image to predict poses for, such as a video or image tag. Importantly. the image or video element fed in should be square.
- Image scale factore: Between 0.2 and 1, default to 0.50. What to scale the image by before feeding it through the network. Set this number lower to scale down the image and increase the speed when feeding through the network at the cost of accuracy
- Flip horizontal: set to be true for webcame to return in proper orientation
- Output stride: must be 32,16,8, default to 16. This parameter affects the height and width of the layers in the neural network. It affected the accuracy and speed of the pose estimation. The lower the value of the output stride, the highter the accuracy but slower the speed, the higher the value the faster the speed but lower the accracy. */

// Device Detection Functions
function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }
  
  function isiOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  
  export function isMobile() {
    return isAndroid() || isiOS();
  }

/* Draw pose keypoints onto a canvas
Iterates over each keypoint and draws a small circle at the position of the keypoint if its score exceeds the minConfidence. */
export function drawKeypoints(keypoints, minConfidence,skeletonColor, ctx,scale=1){
    keypoints.forEach(keypoint => {
        if (keypoint.score >= minConfidence) {
          const { y, x } = keypoint.position
          ctx.beginPath()
          ctx.arc(x * scale, y * scale, 3, 0, 2 * Math.PI)
          ctx.fillStyle = skeletonColor
          ctx.fill()
        }
      })
}

//Helper function: converts position object into an array for easier handling in drawing functions
function toTuple({y,x}){
    return [y,x]
}

// Draws a line segment between two points on the canvas- connect the dots
function drawSegment([ay, ax], [by, bx], color, lineWidth, scale, ctx) {
    ctx.beginPath()
    ctx.moveTo(ax * scale, ay * scale)
    ctx.lineTo(bx * scale, by * scale)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.stroke()
  }

  //Draws a skeleton by connecting adjacent point
  // use posenet.getAdjacentKeyPoints() to get pairs of keypoints that should be connected (left shoulder to left elbow), then calls drawSegment() to draw the actual lines between keypoints
  export function drawSkeleton(keypoints, minConfidence, color, lineWidth, ctx, scale = 1) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence)
  
    adjacentKeyPoints.forEach(keypoints => {
      drawSegment(
        toTuple(keypoints[0].position),
        toTuple(keypoints[1].position),
        color, lineWidth, scale, ctx
      )
    })
  }


