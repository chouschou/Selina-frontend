import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
};

const GLBViewer = ({ url }) => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 2]} />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

export default GLBViewer;