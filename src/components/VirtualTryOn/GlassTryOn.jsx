// import React, { useRef, useEffect } from 'react';
// import GlassesOverlay from './GlassesOverlay';

// export default function GlassTryOn() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     });
//   }, []);

//   return (
//     <>
//       <video
//         ref={videoRef}
//         autoPlay
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           zIndex: 1,
//         }}
//       />
//       <canvas
//         ref={canvasRef}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           zIndex: 2,
//         }}
//       />
//       <GlassesOverlay
//         canvasRef={canvasRef}
//         videoRef={videoRef}
//         selectedGlassesData={{
//           modelPath: '/3Dimages/',
//           modelFile: 'glass.glb',
//           modelX: 0,
//           modelY: 0,
//           modelZ: 0,
//         }}
//       />
//     </>
//   );
// }
