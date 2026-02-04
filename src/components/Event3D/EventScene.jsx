"use client";
import { ScrollControls, Scroll, Stars, Preload, useTexture, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { useRouter } from "next/navigation";
import EventCategory from "./EventCategory";

function SolarSystem({ categories, onEventClick }) {
  const { width } = useThree((state) => state.viewport);
  
  // Load all textures
  const [mercury, venus, earth, mars, jupiter, uranus, neptune] = useTexture([
    "/Textures/mercury.png",
    "/Textures/venus.png",
    "/Textures/earth.jpeg",
    "/Textures/mars.jpeg",
    "/Textures/jupiter.png",
    "/Textures/uranus.jpeg",
    "/Textures/neptune.jpeg",
  ]);

  // Load Saturn model
  const { scene: saturn } = useGLTF("/models/saturn/scene.gltf");

  // Planet configurations
  const planets = [
    { name: "Mercury", texture: mercury, scale: 2 },
    { name: "Venus", texture: venus, scale: 2.2 },
    { name: "Earth", texture: earth, scale: 3, isEarth: true },
    { name: "Mars", texture: mars, scale: 2.5 },
    { name: "Jupiter", texture: jupiter, scale: 4.5 },
    { name: "Saturn", isSaturn: true, model: saturn, scale: 3.5 },
    { name: "Uranus", texture: uranus, scale: 3.5 },
    { name: "Neptune", texture: neptune, scale: 3.5 },
  ];

  const planetStyles = [
    { // Mercury
      font: "/Fonts/HipstersRoundedPersonalUse-d987V.ttf",
      color: "#FFD700",
      text: "Gold"
    },
    { // Venus
      font: "/Fonts/BoldGroovy-zrrEl.otf",
      color: "#FF4500", // OrangeRed
    },
    { // Earth
      font: "/Fonts/HandDrawnLawn-Exae.ttf",
      color: "#32CD32", // LimeGreen
    },
    { // Mars
      font: "/Fonts/TfNukesDemoRegular-BW4Ml.ttf",
      color: "#DC143C", // Crimson
    },
    { // Jupiter
      font: "/Fonts/MirageBoldFreeRegular-vnndD.ttf",
      color: "#D2691E", // Chocolate
    },
    { // Saturn
      font: "/Fonts/WildJusticeFreeTrialBold-GOrYy.otf",
      color: "#F0E68C", // Khaki
    },
    { // Uranus
      font: "/Fonts/CenterFielderDemo-rvGO9.ttf",
      color: "#00CED1", // DarkTurquoise
    },
    { // Neptune
      font: "/Fonts/MirageBoldFreeRegular-vnndD.ttf",
      color: "#4169E1", // RoyalBlue
    }
  ];
  
  const spacer = width * 1; // Increase space to full screen width

  // Limit to 8 planets as requested
  const visibleCategories = categories.slice(0, 8);

  return (
    <ScrollControls
      horizontal
      damping={0.1}
      distance={1}
      pages={visibleCategories.length > 0 ? visibleCategories.length : 2}
      infinite={false}
      enabled={true}
      >
      <Scroll>
        {visibleCategories.map((category, index) => {
          // Cycle through planets
          const planetConfig = planets[index % planets.length];
          const styleConfig = planetStyles[index % planetStyles.length];
          const xPos = index * (width); // Distance equal to one viewport width

          return (
            <EventCategory
              key={category.name}
              position={[xPos, 0, 0]}
              categoryName={category.name}
              events={category.events}
              scale={planetConfig.scale}
              textureMap={planetConfig.texture}
              isSaturn={planetConfig.isSaturn}
              saturnModel={planetConfig.model}
              isEarth={planetConfig.isEarth}
              onEventClick={onEventClick}
              customFont={styleConfig.font}
              customColor={styleConfig.color}
              customText={styleConfig.text || null}
            />
          );
        })}
      </Scroll>
    </ScrollControls>
  );
}

export default function EventScene({ categories }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEventClick = (id) => {
    router.push(`/portal/event/${id}`);
  };

  if (!mounted) {
    return (
      <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "white" }}>Loading 3D Solar System...</p>
      </div>
    );
  }

  const frustumSize = 430;
  // Fallback aspect if window is not available (though checked by mounted)
  const aspect = typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1;

  return (
    <div style={{ width: "100%", height: "100vh", touchAction: "pan-x" }}>
      <Canvas
        orthographic
        camera={{
          left: (frustumSize * aspect) / -2,
          right: (frustumSize * aspect) / 2,
          top: frustumSize / 2,
          bottom: frustumSize / -2,
          far: 2000,
          near: 0.1,
          zoom: isMobile ? 35 : isTablet ? 45 : 55, // Adjusted zoom slightly
        }}
        style={{ background: "transparent" }}>
        <Suspense fallback={null}>
          <directionalLight intensity={1.5} position={[-5, 3, 0]} />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />

          <SolarSystem categories={categories} onEventClick={handleEventClick} />

          <Preload all />
          <Stars
            radius={0.0001}
            depth={35}
            count={50000}
            factor={1}
            saturation={0}
            fade
            speed={2}
          />
        </Suspense>
      </Canvas>

      {/* Instructions overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          textAlign: "center",
          fontSize: "14px",
          pointerEvents: "none",
          zIndex: 10,
        }}>
        <p style={{ margin: "5px 0", opacity: 0.8, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
          {isMobile || isTablet ? "Swipe horizontally to explore" : "Move mouse to scroll horizontally"}
        </p>
      </div>
    </div>
  );
}

// Preload the Saturn model
useGLTF.preload("/models/saturn/scene.gltf");
