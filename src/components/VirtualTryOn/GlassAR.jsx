// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import * as faceapi from "face-api.js";

// export default function GlassesAR() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const webglRef = useRef(null);

//   const [isWebcamOn, setIsWebcamOn] = useState(false);
//   const glassesModelRef = useRef(null);

//   // Three.js vars
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const rendererRef = useRef(null);
//   const controlsRef = useRef(null);
//   const animationFrameId = useRef(null);

//   // Load face-api models
//   const loadFaceModels = async () => {
//     const MODEL_URL = "/models"; // Đường dẫn chứa model face-api
//     await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//     await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
//   };

//   // Setup Three.js scene
//   const setupThreeJS = () => {
//     const width = canvasRef.current.width;
//     const height = canvasRef.current.height;

//     // Renderer
//     rendererRef.current = new THREE.WebGLRenderer({
//       alpha: true,
//       antialias: true,
//     });
//     rendererRef.current.setSize(width, height);
//     rendererRef.current.setClearColor(0x000000, 0);
//     webglRef.current.appendChild(rendererRef.current.domElement);
//     console.log("Appending WebGL canvas to:", webglRef.current);


//     // Scene
//     sceneRef.current = new THREE.Scene();

//     // Camera
//     cameraRef.current = new THREE.PerspectiveCamera(
//       45,
//       width / height,
//       0.1,
//       1000
//     );
//     cameraRef.current.position.set(0, 0, 5);

//     // Controls
//     controlsRef.current = new OrbitControls(
//       cameraRef.current,
//       rendererRef.current.domElement
//     );
//     controlsRef.current.enableDamping = true;
//     controlsRef.current.dampingFactor = 0.25;
//     controlsRef.current.screenSpacePanning = false;
//     controlsRef.current.maxPolarAngle = Math.PI / 2;

//     // Load GLTF glasses model
//     const loader = new GLTFLoader();
//     loader.load(
//       "/3Dimages/glass.glb",
//       (gltf) => {
//         glassesModelRef.current = gltf.scene;
//         glassesModelRef.current.scale.set(0.04, 0.04, 0.04);
//         sceneRef.current.add(glassesModelRef.current);
//         glassesModelRef.current.visible = false;
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading GLTF model:", error);
//       }
//     );
//   };

//   // Start webcam stream
//   const startWebcam = async () => {
//     if (!videoRef.current) return;
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//       await videoRef.current.play();
//       setIsWebcamOn(true);
//       console.log("Webcam stream started:", stream);
//     } catch (err) {
//       console.error("Error accessing webcam:", err);
//     }
//   };

//   // Stop webcam stream
//   const stopWebcam = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//       setIsWebcamOn(false);
//     }
//   };

//   // Map 2D webcam coords to 3D scene coords (tùy chỉnh theo ý bạn)
//   const mapTo3DCoords = (x, y, width, height) => {
//     // Normalized device coordinates -1 to 1
//     const nx = (x / width) * 2 - 1;
//     const ny = -((y / height) * 2 - 1);
//     return [nx * 2, ny * 2, 0]; // nhân scale cho dễ nhìn
//   };

//   // Detect face and landmarks + update glasses position
//   const detectAndRender = async () => {
//     if (!isWebcamOn || !videoRef.current || !canvasRef.current) {
//       animationFrameId.current = requestAnimationFrame(detectAndRender);
//       return;
//     }

//     const width = canvasRef.current.width;
//     const height = canvasRef.current.height;
//     const ctx = canvasRef.current.getContext("2d");

//     // Detect single face with landmarks
//     const detection = await faceapi
//       .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//       .withFaceLandmarks(true);

//     ctx.clearRect(0, 0, width, height);

//     if (detection) {
//       const landmarks = detection.landmarks;

//       // Draw landmarks points
//       landmarks.positions.forEach((pos) => {
//         ctx.fillStyle = "red";
//         ctx.beginPath();
//         ctx.arc(pos.x, pos.y, 2, 0, 2 * Math.PI);
//         ctx.fill();
//       });

//       // Tính trung điểm kính (giữa mắt trái và mắt phải)
//       const leftEye = landmarks.getLeftEye();
//       const rightEye = landmarks.getRightEye();
//       const avgX = (leftEye[0].x + rightEye[3].x) / 2;
//       const avgY = (leftEye[0].y + rightEye[3].y) / 2;

//       if (glassesModelRef.current) {
//         glassesModelRef.current.visible = true;
//         const [x3D, y3D, z3D] = mapTo3DCoords(avgX, avgY, width, height);
//         glassesModelRef.current.position.set(x3D, y3D, z3D);
//         glassesModelRef.current.rotation.set(0, 0, 0);

//         console.log("Landmarks detected:", landmarks);
//         console.log("Set glasses position to:", x3D, y3D, z3D);
//       }
//     } else {
//       if (glassesModelRef.current) glassesModelRef.current.visible = false;
//     }

//     controlsRef.current.update();
//     rendererRef.current.render(sceneRef.current, cameraRef.current);

//     animationFrameId.current = requestAnimationFrame(detectAndRender);
//   };

//   // Effect khởi tạo khi component mount
//   useEffect(() => {
//     const init = async () => {
//       await loadFaceModels();
//       setupThreeJS();
//     };
//     init();

//     // Set canvas size = video size (có thể chỉnh lại nếu cần)
//     if (canvasRef.current && videoRef.current) {
//       canvasRef.current.width = 640;
//       canvasRef.current.height = 480;
//     }

//     return () => {
//       stopWebcam();
//       if (animationFrameId.current)
//         cancelAnimationFrame(animationFrameId.current);
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//         rendererRef.current.forceContextLoss();
//       }
//     };
//   }, []);

//   // Khi webcam bật tắt thì bắt đầu hoặc dừng detect
//   useEffect(() => {
//     if (isWebcamOn) {
//       detectAndRender();
//     } else {
//       if (animationFrameId.current)
//         cancelAnimationFrame(animationFrameId.current);
//       const ctx = canvasRef.current?.getContext("2d");
//       ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//       if (glassesModelRef.current) glassesModelRef.current.visible = false;
//     }
//   }, [isWebcamOn]);

//   return (
//     <div>
//       <div style={{ position: "relative", width: 640, height: 480 }}>
//         <video
//           ref={videoRef}
//           style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
//           width={640}
//           height={480}
//           muted
//           playsInline
//           autoPlay
//         />
//         <canvas
//           ref={canvasRef}
//           style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
//           width={640}
//           height={480}
//         />
//         <div
//           ref={webglRef}
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             zIndex: 2,
//             width: 640,
//             height: 480,
//           }}
//         />
//       </div>

//       <label style={{ marginTop: 10 }}>
//         <input
//           type="checkbox"
//           checked={isWebcamOn}
//           onChange={(e) => {
//             if (e.target.checked) startWebcam();
//             else stopWebcam();
//           }}
//         />
//         Bật webcam và kính ảo
//       </label>
//     </div>
//   );
// }
