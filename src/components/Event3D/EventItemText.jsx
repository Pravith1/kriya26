"use client";
import { Float, Text3D } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EventItemText({ position, text, eventId }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    router.push(`/portal/event/${eventId}`);
  };

  return (
    <group position={position}>
      <Float
        speed={isHovered ? 1.5 : 0}
        rotationIntensity={0.1}
        floatIntensity={0.2}
        floatingRange={[-0.05, 0.05]}
      >
        <Text3D
          font="/Fonts/Poppins.json"
          size={0.3}
          height={0.01}
          curveSegments={12}
          bevelEnabled
          bevelSize={0.01}
          bevelThickness={0.01}
          onClick={handleClick}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          renderOrder={999}
        >
          {text}
          <meshStandardMaterial
            color={isHovered ? "#ffbb00" : "white"}
            emissive={isHovered ? "#ffbb00" : "#000000"}
            emissiveIntensity={isHovered ? 1 : 0}
            depthTest={false}
          />
        </Text3D>
      </Float>
    </group>
  );
}
