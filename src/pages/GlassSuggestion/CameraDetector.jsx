import React, { useRef, useState } from 'react';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImageData(dataUrl);
    sendToBackend(dataUrl);
  };

  const sendToBackend = async (base64Image) => {
    const response = await fetch('/api/face-shape', {
      method: 'POST',
      body: JSON.stringify({ image: base64Image }),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    console.log('Face shape:', result.shape);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '400px' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <button onClick={startCamera}>Bật Camera</button>
      <button onClick={capture}>Chụp & Gửi</button>
    </div>
  );
};

export default CameraCapture;
