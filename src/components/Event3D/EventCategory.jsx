"use client";
import { useIntersect } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import EventSphere from "./EventSphere";
import EventText from "./EventText";
import EventItemText from "./EventItemText";

export default function EventCategory({
  position,
  categoryName,
  events,
  scale = 2.5,
  textureMap,
  isSaturn,
  saturnModel,
  isEarth,
  onEventClick,
  customFont,
  customColor,
  customText,
}) {
  const visible = useRef(false);
  const ref = useIntersect((isVisible) => (visible.current = isVisible));

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (visible.current) {
      setAnimate(true);
    }
  }, [visible]);

  const eventSpacing = 0.5;
  const startY = -1.5;

  return (
    <group position={position}>
      <group ref={ref}>
        <EventSphere
          scale={scale}
          animate={animate}
          textureMap={textureMap}
          isSaturn={isSaturn}
          saturnModel={saturnModel}
          isEarth={isEarth}
        />
      </group>
      <EventText 
        position={[0, 0, 0]} 
        text={customText || categoryName} 
        radius={scale} 
        customFont={customFont} 
        customColor={customColor} 
      />
      
      {/* Render event names as 3D text below the planet */}
      {events.map((event, index) => (
        <EventItemText
          key={event.id}
          position={[0, startY - index * eventSpacing, 0]}
          text={event.name}
          eventId={event.id}
        />
      ))}
    </group>
  );
}
