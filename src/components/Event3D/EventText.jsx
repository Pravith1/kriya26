"use client";
import { Center, Float, Text3D, Text } from "@react-three/drei";
import { useMemo } from "react";

export default function EventText({ position, text, scale = 0.25, radius = 2.5, customFont, customColor }) {
  // Position text above the planet based on its radius
  const yOffset = radius + 1.2;
  
  return (
    <group position={[position[0], position[1] + yOffset, position[2]]}>
      <Center>
        <Float
          speed={0.05}
          rotationIntensity={0.05}
          floatIntensity={0.05}
          floatingRange={[0.01, 0.02]}>
          {customFont ? (
            <Text
              font={customFont}
              color={customColor || "white"}
              fontSize={3}
              scale={scale * 2}
              anchorX="center"
              anchorY="middle"
            >
              {text}
            </Text>
          ) : (
            <Text3D
              rotation={[0, 0, 0]}
              scale={scale}
              size={0.7}
              curveSegments={32}
              bevelEnabled
              bevelSize={0.02}
              bevelThickness={0.03}
              height={0.01}
              lineHeight={0.8}
              letterSpacing={0.02}
              font='/Fonts/Poppins.json'
              renderOrder={999}>
              {text}
              <meshNormalMaterial depthTest={false} />
            </Text3D>
          )}
        </Float>
      </Center>
    </group>
  );
}
