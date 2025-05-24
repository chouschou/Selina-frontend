// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
// import "@tensorflow/tfjs-backend-webgl";
// // import {
// //   SupportedModels,
// //   load,
// // } from "@tensorflow-models/face-landmarks-detection";


// const GlassesOverlay = ({ canvasRef, videoRef, selectedGlassesData }) => {
//   const modelRef = useRef();
//   const sceneRef = useRef();
//   const cameraRef = useRef();
//   const rendererRef = useRef();
//   const glassesRef = useRef();

//   useEffect(() => {
//     const webcamElement = videoRef.current;
//     const canvasElement = canvasRef.current;

//     console.log("canvasElement:", canvasElement);
//     console.log("webcamElement:", webcamElement);

//     if (!webcamElement || !canvasElement) {
//       console.warn("webcamElement hoặc canvasElement chưa sẵn sàng");
//       return;
//     }

//     const initThree = async () => {
//       const videoWidth = webcamElement.videoWidth;
//       const videoHeight = webcamElement.videoHeight;

//       const scene = new THREE.Scene();
//       sceneRef.current = scene;

//       const renderer = new THREE.WebGLRenderer({
//         canvas: canvasElement,
//         alpha: true,
//       });
//       renderer.setSize(videoWidth, videoHeight);
//       renderer.setClearColor(0x000000, 0);
//       rendererRef.current = renderer;

//       const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
//       camera.position.set(
//         videoWidth / 2,
//         -videoHeight / 2,
//         -(videoHeight / 2) / Math.tan(45 / 2)
//       );
//       camera.lookAt(new THREE.Vector3(videoWidth / 2, -videoHeight / 2, 0));
//       cameraRef.current = camera;

//       const loader = new GLTFLoader();
//       loader.setPath(selectedGlassesData.modelPath);
//       loader.load(
//         selectedGlassesData.modelFile,
//         (gltf) => {
//           console.log("Model GLTF loaded:", gltf);
//           const glasses = gltf.scene;
//           glasses.position.set(
//             selectedGlassesData.modelX,
//             selectedGlassesData.modelY,
//             selectedGlassesData.modelZ
//           );
//           scene.add(glasses);
//           glassesRef.current = glasses;
//         },
//         undefined,
//         (error) => {
//           console.error("Error loading GLTF model:", error);
//         }
//       );

//       const model = await faceLandmarksDetection.load(
//         faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
//         {
//           maxFaces: 1,
//           runtime: "tfjs",
//         }
//       );

//       modelRef.current = model;

//       const detectFaces = async () => {
//         const faces = await model.estimateFaces({
//           input: webcamElement,
//           returnTensors: false,
//           flipHorizontal: false,
//           predictIrises: false,
//         });

//         if (faces.length > 0 && glassesRef.current) {
//           const face = faces[0];
//           const keypoints = face.scaledMesh;
//           const pointMidEye = keypoints[168];
//           const pointNoseBottom = keypoints[2];
//           const pointLeftEye = keypoints[33];
//           const pointRightEye = keypoints[263];

//           const glasses = glassesRef.current;
//           glasses.position.set(
//             pointMidEye[0],
//             -pointMidEye[1],
//             -camera.position.z + pointMidEye[2]
//           );

//           const upVector = new THREE.Vector3(
//             pointMidEye[0] - pointNoseBottom[0],
//             -(pointMidEye[1] - pointNoseBottom[1]),
//             pointMidEye[2] - pointNoseBottom[2]
//           ).normalize();
//           glasses.up.copy(upVector);

//           const eyeDist = new THREE.Vector3(
//             pointLeftEye[0] - pointRightEye[0],
//             pointLeftEye[1] - pointRightEye[1],
//             pointLeftEye[2] - pointRightEye[2]
//           ).length();

//           glasses.scale.set(eyeDist, eyeDist, eyeDist);
//           glasses.rotation.y = Math.PI;
//           glasses.rotation.z = Math.PI / 2 - Math.acos(upVector.x);
//         }

//         renderer.render(scene, camera);
//         requestAnimationFrame(detectFaces);
//       };

//       detectFaces();
//     };

//     if (webcamElement.readyState >= 2) {
//       initThree();
//     } else {
//       webcamElement.onloadeddata = () => {
//         console.log("webcam onloadeddata triggered");
//         initThree();
//       };
//     }
//   }, [canvasRef, videoRef, selectedGlassesData]);

//   return null;
// };

// export default GlassesOverlay;
