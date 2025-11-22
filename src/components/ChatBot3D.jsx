import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import { useRef } from "react";

function RobotHead() {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime / 2) * 0.15;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 3) * 0.05;
  });

  return (
    <group ref={ref} dispose={null} rotation={[0, 0, 0]}>
      {/* head */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.6, 48, 48]} />
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.55}
          color="#6366f1"
        />
      </mesh>

      {/* left eye */}
      <mesh position={[-0.2, 0.05, 0.55]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial emissive="#fff" color="#ffffff" />
      </mesh>

      {/* right eye */}
      <mesh position={[0.2, 0.05, 0.55]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial emissive="#fff" color="#ffffff" />
      </mesh>

      {/* subtle floating ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <torusGeometry args={[0.95, 0.03, 16, 100]} />
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function ChatBot3D() {
  return (
    <Canvas camera={{ position: [0, 0, 3.5] }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <RobotHead />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
