// // src/components/FaceDetector.jsx
// import React, { useEffect, useRef } from 'react';
// import * as faceapi from 'face-api.js';

// const FaceDetector = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = process.env.PUBLIC_URL + '/models';
//       await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//       console.log('Model loaded');
//       startVideo();
//     };

//     const startVideo = () => {
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then((stream) => {
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//           }
//         })
//         .catch((err) => console.error('Camera error:', err));
//     };

//     const detectFace = async () => {
//       if (
//         videoRef.current &&
//         videoRef.current.readyState === 4 &&
//         faceapi.nets.tinyFaceDetector.params
//       ) {
//         const result = await faceapi.detectSingleFace(
//           videoRef.current,
//           new faceapi.TinyFaceDetectorOptions()
//         );

//         const canvas = canvasRef.current;
//         if (canvas && result) {
//           const dims = faceapi.matchDimensions(canvas, videoRef.current, true);
//           const resizedResult = faceapi.resizeResults(result, dims);
//           faceapi.draw.drawDetections(canvas, resizedResult);
//         }
//       }
//     };

//     loadModels();

//     const interval = setInterval(detectFace, 200);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div>
//       <h2>Face Detection</h2>
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         width="320"
//         height="240"
//         style={{ border: '1px solid black' }}
//       />
//       <canvas ref={canvasRef} width="320" height="240" />
//     </div>
//   );
// };

// export default FaceDetector;
