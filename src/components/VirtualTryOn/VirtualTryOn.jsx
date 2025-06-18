import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as THREE from "three";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
// import glassesSrc from './assets/images/sunglasses.png';
// import glassesSrc from "./assets/images/glass7-nobg.png";
// import glassesSrc from './assets/images/2719_cleanup_crop_nobg.jpg';
const VirtualTryOn = ({ urlImage = "images/glassVirtualTryOn2.png" }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [glassesMesh, setGlassesMesh] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        // Camera Access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }

        // TensorFlow Model
        await tf.setBackend("webgl");
        const loadedModel = await faceLandmarksDetection.load(
          faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
          { shouldLoadIrisModel: true, maxFaces: 1 }
        );
        setModel(loadedModel);

        // Three.js Setup
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          width / height,
          0.1,
          1000
        );
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(() => renderer.render(scene, camera));

        // Glasses Mesh
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(urlImage, (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          const geometry = new THREE.PlaneGeometry(2, 1);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
          });
          const glasses = new THREE.Mesh(geometry, material);
          scene.add(glasses);
          setGlassesMesh(glasses);
        });
      } catch (error) {
        console.error("Initialization error:", error);
        setIsLoading(false);
      }
    };

    loadResources();

    // Dọn dẹp stream khi component bị unmount
    return () => {
      if (webcamRef.current && webcamRef.current.srcObject) {
        webcamRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // useEffect(() => {
  //   let animationFrameId;

  //   const detectAndPositionGlasses = async () => {
  //     if (!webcamRef.current || !model || !glassesMesh) return;
  //     const video = webcamRef.current.video;
  //     if (video.readyState !== 4) return;

  //     const faceEstimates = await model.estimateFaces({ input: video });
  //     if (faceEstimates.length > 0) {
  //       setIsLoading(false);
  //       const keypoints = faceEstimates[0].scaledMesh;

  //       // Glasses positioning
  //       const leftEye = keypoints[130];
  //       const rightEye = keypoints[359];
  //       const eyeCenter = keypoints[168];

  //       const eyeDistance = Math.sqrt(
  //         Math.pow(rightEye[0] - leftEye[0], 2) + Math.pow(rightEye[1] - leftEye[1], 2)
  //       );
  //       const scaleMultiplier = eyeDistance / 140;

  //       glassesMesh.position.x = (eyeCenter[0] - video.videoWidth / 2) * -0.01;
  //       glassesMesh.position.y = (eyeCenter[1] - video.videoHeight / 2) * -0.005;
  //       glassesMesh.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
  //       glassesMesh.position.z = 1;

  //       const eyeLine = new THREE.Vector2(rightEye[0] - leftEye[0], rightEye[1] - leftEye[1]);
  //       const rotationZ = Math.atan2(eyeLine.y, eyeLine.x);
  //       glassesMesh.rotation.z = rotationZ;
  //     }

  //     animationFrameId = requestAnimationFrame(detectAndPositionGlasses);
  //   };

  //   detectAndPositionGlasses();

  //   return () => cancelAnimationFrame(animationFrameId);
  // }, [model, glassesMesh]);

  useEffect(() => {
    let animationFrameId;

    const detectAndPositionGlasses = async () => {
      if (!webcamRef.current || !model || !glassesMesh) return;
      const video = webcamRef.current.video;
      if (video.readyState !== 4) return;

      const faceEstimates = await model.estimateFaces({ input: video });
      if (faceEstimates.length > 0) {
        setIsLoading(false);
        const keypoints = faceEstimates[0].scaledMesh;

        // Các điểm tham chiếu
        const leftEye = keypoints[130]; // [x, y, z]
        const rightEye = keypoints[359]; // [x, y, z]
        const eyeCenter = keypoints[168]; // trung điểm mắt
        const noseTip = keypoints[1]; // mũi
        const chin = keypoints[152]; // cằm

        // Tính khoảng cách giữa hai mắt để scale kính
        const eyeDistance = Math.sqrt(
          Math.pow(rightEye[0] - leftEye[0], 2) +
            Math.pow(rightEye[1] - leftEye[1], 2)
        );
        // const scaleMultiplier = eyeDistance / 140;
        const scaleMultiplier = eyeDistance / 140;

        // Position kính (đưa về tâm video, chỉnh scale)
        glassesMesh.position.x = (eyeCenter[0] - video.videoWidth / 2) * -0.01;
        glassesMesh.position.y =
          (eyeCenter[1] - video.videoHeight / 2) * -0.005;
        glassesMesh.position.z = 1; // giữ z cố định
        glassesMesh.scale.set(
          scaleMultiplier,
          scaleMultiplier,
          scaleMultiplier
        );

        // --- Tính rotation.z (nghiêng đầu qua trái/phải) ---
        const eyeLine = new THREE.Vector2(
          rightEye[0] - leftEye[0],
          rightEye[1] - leftEye[1]
        );
        const rotationZ = Math.atan2(eyeLine.y, eyeLine.x);

        // --- Tính rotation.y (quay đầu sang trái/phải) ---
        // Dùng delta Z giữa mắt phải và mắt trái (3D)
        const deltaZ = -rightEye[2] + leftEye[2];
        const deltaX = rightEye[0] - leftEye[0];
        const rotationY = Math.atan2(deltaZ, deltaX);

        // --- Tính rotation.x (gật đầu lên/xuống) ---
        // Dùng delta Y và delta Z giữa mũi và cằm
        const deltaYZ = chin[1] - noseTip[1]; // chiều dọc (y)
        const deltaZZ = chin[2] - noseTip[2]; // chiều sâu (z)
        const rotationX = Math.atan2(deltaZZ, deltaYZ);

        // Gán các rotation vào kính
        glassesMesh.rotation.set(rotationX, rotationY, rotationZ);
      }

      animationFrameId = requestAnimationFrame(detectAndPositionGlasses);
    };

    detectAndPositionGlasses();

    return () => cancelAnimationFrame(animationFrameId);
  }, [model, glassesMesh]);

  return (
    <>
      {/* <div style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.2)" }}>
        <h1 style={{ textAlign: "center" }}>Virtual Try-On - 2D Glasses</h1>
      </div> */}
      <div
        style={{
          position: "relative",
          margin: "0 auto",
          width: "550px",
          height: "550px",
          padding: 0,
        }}
      >
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <h3>Loading...</h3>
          </div>
        )}
        <Webcam
          ref={webcamRef}
          autoPlay
          playsInline
          style={{ width: "550px", height: "550px" }}
          mirrored={true}
        />
        <canvas
          ref={canvasRef}
          style={{
            width: "550px",
            height: "550px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>
    </>
  );
};

export default VirtualTryOn;

// ===================---------------------================-------------------------------------

// import { useEffect, useRef, useState } from "react";
// import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// import { Canvas, useFrame, useLoader } from "@react-three/fiber";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import * as THREE from "three";

// function Glasses({ position, rotation }) {
//   const gltf = useLoader(GLTFLoader, "/3Dimages/glass.glb");

//   // Cập nhật vị trí & rotation theo mặt
//   return (
//     <primitive
//       object={gltf.scene}
//       position={position}
//       rotation={rotation}
//       scale={[1.1, 1.1, 1.1]}
//     />
//   );
// }

// function GlassesScene({ faceLandmarks, videoRef }) {
//   const gltf = useLoader(GLTFLoader, "/3Dimages/glass.glb");
//   // console.log(gltf);
//   const glassesRef = useRef();

//   useFrame(() => {
//     if (faceLandmarks && glassesRef.current) {
//       // const p27 = faceLandmarks[27];
//       // const p28 = faceLandmarks[28];
//       // const p29 = faceLandmarks[29];

//       // const x = (p27[0] + p28[0] + p29[0]) / 3;
//       // const y = (p27[1] + p28[1] + p29[1]) / 3;
//       // const z = (p27[2] + p28[2] + p29[2]) / 3;

//       // // Điều chỉnh scale để hợp với camera (giả định gương mặt ở giữa)
//       // glassesRef.current.position.set(
//       //   (x - 0.5) * 2, // có thể nhân thêm scale như *(videoWidth / videoHeight)
//       //   -(y - 0.5) * 2,
//       //   -z * 2
//       // );
//       if (faceLandmarks && glassesRef.current && videoRef.current) {
//         // Lấy các điểm cần thiết
//         const nose = faceLandmarks[6]; // mũi
//         const leftEye = faceLandmarks[33];
//         const rightEye = faceLandmarks[263];

//         if (nose && leftEye && rightEye) {
//           const x = nose.x;
//           const y = nose.y;
//           const z = nose.z;

//           // Tính góc quay giữa 2 mắt (mặt nghiêng trái/phải)
//           const dx = rightEye.x - leftEye.x;
//           const dy = rightEye.y - leftEye.y;
//           const angleZ = Math.atan2(dy, dx);

//           // Lấy tỷ lệ video
//           const videoWidth = videoRef.current.videoWidth;
//           const videoHeight = videoRef.current.videoHeight;
//           const aspect = videoWidth / videoHeight;

//           // Cập nhật vị trí kính
//           glassesRef.current.position.set(
//             (x-0.75) *aspect * 2,
//             -(y-0.25) * 2,
//             -z * 0.25 // có thể điều chỉnh
//           );

//           // Cập nhật xoay theo hướng mặt
//           glassesRef.current.rotation.set(0, 0, -angleZ);
//         }
//       }
//     }
//   });

//   return (
//     <primitive
//       ref={glassesRef}
//       object={gltf.scene}
//       scale={[0.72, 0.72, 0.72]} // Có thể chỉnh lại scale nhỏ hơn
//     />
//   );
// }

// export default function VirtualtryOn() {
//   const videoRef = useRef(null);
//   const [faceLandmarks, setFaceLandmarks] = useState(null);
//   const faceLandmarkerRef = useRef(null);

//   useEffect(() => {
//     const setup = async () => {
//       const vision = await FilesetResolver.forVisionTasks(
//         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
//       );

//       faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
//         vision,
//         {
//           baseOptions: {
//             modelAssetPath: "models/face_landmarker.task",
//             delegate: "GPU",
//           },
//           runningMode: "VIDEO",
//           numFaces: 1,
//         }
//       );

//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       //   videoRef.current.srcObject = stream
//       //   videoRef.current.play()
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;

//         videoRef.current.onloadedmetadata = () => {
//           videoRef.current.play();
//           detect(); // Chỉ bắt đầu detect sau khi video đã sẵn sàng
//         };
//       }

//       const detect = async () => {
//         // if (!faceLandmarkerRef.current) return;

//         // const faces = await faceLandmarkerRef.current.detectForVideo(
//         //   videoRef.current,
//         //   performance.now()
//         // );

//         if (
//           !faceLandmarkerRef.current ||
//           !videoRef.current ||
//           videoRef.current.readyState < 2 // ✅ Ensure video is ready
//         )
//           return;

//         const faces = await faceLandmarkerRef.current.detectForVideo(
//           videoRef.current,
//           performance.now()
//         );

//         if (faces && faces.faceLandmarks.length > 0) {
//           setFaceLandmarks(faces.faceLandmarks[0]);
//         } else {
//           setFaceLandmarks(null);
//         }
//         requestAnimationFrame(detect);
//       };

//       detect();
//     };

//     setup();
//   }, []);

//   return (
//     <>
//       <video
//         ref={videoRef}
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           opacity: 0.9,
//         }}
//       />
//       <Canvas
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//         }}
//       >
//         <ambientLight />
//         <directionalLight position={[10, 0, 0]} />
//         {faceLandmarks && <GlassesScene faceLandmarks={faceLandmarks} videoRef={videoRef} />}
//       </Canvas>
//     </>
//   );
// }

// ------------------------------------------------------------------------------------------------------------------------

// import React, { useRef, useState, useEffect } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useLoader } from "@react-three/fiber";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import * as THREE from "three";
// import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

// function Glasses({ faceLandmarks }) {
//   const glassesRef = useRef();
//   const gltf = useLoader(GLTFLoader, "/3Dimages/glass3.glb"); // Đảm bảo nằm trong public

//   useFrame(() => {
//     if (!faceLandmarks || !glassesRef.current) return;

//     // Các điểm cần thiết
//     const nose = faceLandmarks[168] ?? faceLandmarks[1]; // trung tâm sống mũi
//     const leftEye = faceLandmarks[33];
//     const rightEye = faceLandmarks[263];

//     if (!nose || !leftEye || !rightEye) return;

//     // Tọa độ
//     const x = nose.x ?? nose[0];
//     const y = nose.y ?? nose[1];
//     const z = nose.z ?? nose[2];

//     // Position (chuyển từ normalized về [-1..1])
//     glassesRef.current.position.set((x - 0.5) * 2, -(y - 0.5) * 2, -z * 2);

//     // Rotation theo vector mắt trái – phải
//     const dx = (rightEye.x ?? rightEye[0]) - (leftEye.x ?? leftEye[0]);
//     const dy = (rightEye.y ?? rightEye[1]) - (leftEye.y ?? leftEye[1]);
//     const angleZ = Math.atan2(dy, dx);
//     glassesRef.current.rotation.set(0, 0, -angleZ);

//     // Scale theo khoảng cách mắt
//     const eyeDist = Math.sqrt(dx * dx + dy * dy);
//     const scaleFactor = eyeDist * 8; // Tinh chỉnh hệ số nếu cần
//     glassesRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
//   });

//   return (
//     <primitive ref={glassesRef} object={gltf.scene} />
//   );
// }

// export default function VirtualTryOn() {
//   const videoRef = useRef(null);
//   const [faceLandmarks, setFaceLandmarks] = useState(null);
//   const faceLandmarkerRef = useRef(null);

//   useEffect(() => {
//     const setup = async () => {
//       const vision = await FilesetResolver.forVisionTasks(
//         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
//       );

//       faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
//         vision,
//         {
//           baseOptions: {
//             modelAssetPath: "/models/face_landmarker.task",
//             delegate: "GPU",
//           },
//           runningMode: "VIDEO",
//           numFaces: 1,
//         }
//       );

//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.onloadedmetadata = () => {
//           videoRef.current.play();
//           detect();
//         };
//       }

//       const detect = async () => {
//         if (
//           !faceLandmarkerRef.current ||
//           !videoRef.current ||
//           videoRef.current.readyState < 2
//         )
//           return;

//         const result = await faceLandmarkerRef.current.detectForVideo(
//           videoRef.current,
//           performance.now()
//         );

//         if (result.faceLandmarks.length > 0) {
//           setFaceLandmarks(result.faceLandmarks[0]);
//         } else {
//           setFaceLandmarks(null);
//         }

//         requestAnimationFrame(detect);
//       };

//       detect();
//     };

//     setup();
//   }, []);

//   return (
//     <>
//       <video
//         ref={videoRef}
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           opacity: 0.9,
//           objectFit: "cover",
//         }}
//       />
//       <Canvas
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//         }}
//       >
//         <ambientLight />
//         <directionalLight position={[0, 0, 5]} />
//         {faceLandmarks && <Glasses faceLandmarks={faceLandmarks} />}
//       </Canvas>
//     </>
//   );
// }

// =================================================================================================================================

// import { useEffect, useRef } from "react";
// import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// const VirtualTryOn = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const faceLandmarkerRef = useRef(null);

//   useEffect(() => {
//     const setup = async () => {
//       const vision = await FilesetResolver.forVisionTasks(
//         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
//       );

//       faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
//         vision,
//         {
//           baseOptions: {
//             modelAssetPath: "/models/face_landmarker.task",
//             delegate: "GPU",
//           },
//           runningMode: "VIDEO",
//           numFaces: 1,
//         }
//       );

//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;

//       videoRef.current.onloadedmetadata = () => {
//         videoRef.current.play();
//         detect(); // ✅ Bắt đầu detect sau khi play
//       };

//       const detect = async () => {
//         if (!faceLandmarkerRef.current || !videoRef.current) return;

//         const face = await faceLandmarkerRef.current.detectForVideo(
//           videoRef.current,
//           performance.now()
//         );

//         if (face?.faceLandmarks.length > 0) {
//           const noseTip = face.faceLandmarks[0][1];
//           console.log("Nose tip:", noseTip);
//         }

//         requestAnimationFrame(detect);
//       };
//     };

//     setup();
//   }, []);

//   return (
//     <div>
//       <video
//         ref={videoRef}
//         style={{ display: "none" }}
//         width={640}
//         height={480}
//       />
//       <canvas ref={canvasRef} width={640} height={480} />
//     </div>
//   );
// };

// export default VirtualTryOn;
