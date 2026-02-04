"use client";
import { useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import { useTexture } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

export default function EventSphere({
  scale,
  animate,
  textureMap,
  isSaturn,
  saturnModel,
  isEarth,
}) {
  const sphereRef = useRef();
  const groupRef = useRef();

  // Clone and fix Saturn model
  const clonedSaturn = useMemo(() => {
    if (saturnModel) {
      const clone = saturnModel.clone(true);
      
      // Traverse and ensure all materials are visible and properly configured
      clone.traverse((child) => {
        if (child.isMesh) {
          child.visible = true;
          child.castShadow = true;
          child.receiveShadow = true;
          
          if (child.material) {
            // Clone material to avoid modifying the original
            child.material = child.material.clone();
            child.material.visible = true;
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
            
            // Ensure proper rendering
            if (child.material.map) {
              child.material.map.needsUpdate = true;
            }
          }
        }
      });
      
      return clone;
    }
    return null;
  }, [saturnModel]);

  useFrame(() => {
    if (isSaturn && groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    } else if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.002;
    }
  });

  const [normal, roughness] = useTexture([
    "/Textures/normal.jpg",
    "/Textures/roughness.png",
  ]);

  const props = useSpring({
    
  });

  if (isSaturn && clonedSaturn) {
    return (
      <group
        ref={groupRef}
        scale={scale}
      >
        <primitive object={clonedSaturn} />
      </group>
    );
  }

  return (
    <a.mesh  
      ref={sphereRef} 
      scale={scale}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={textureMap}
        normalMap={isEarth ? normal : null}
        roughnessMap={isEarth ? null : roughness}
        roughness={isEarth ? 0.5 : 1}
      />
    </a.mesh>
  );
}
