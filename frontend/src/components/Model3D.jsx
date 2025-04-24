import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

function CustomModel() {
  const gltf = useLoader(GLTFLoader, '/models/magazine/scene.gltf');
  
  return (
    <primitive 
      object={gltf.scene} 
      scale={[1, 1, 1]} // Увеличиваем масштаб модели
      rotation={[0, 0, 0]} 
      position={[0, -1, 0]} 
    />
  );
}

function Model3D() {
  return (
    <Canvas 
      style={{ 
        width: '200px', 
        height: '200px', 
        background: 'transparent', 
        marginTop: '-20px',
        marginLeft: '3px',
        zIndex: 1,
      }}
      gl={{ alpha: true }}
      camera={{ 
        position: [0, 0, 5], 
        fov: 45 // Уменьшаем угол обзора камеры для более крупного изображения
      }}
    >
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      
      <Suspense fallback={null}>
        <CustomModel />
      </Suspense>
      
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        maxAzimuthAngle={Infinity}
        minAzimuthAngle={-Infinity}
      />
    </Canvas>
  );
}

export default Model3D;