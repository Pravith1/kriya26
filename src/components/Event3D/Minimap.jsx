"use client";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function Minimap({ position, categories }) {
  const { viewport } = useThree();
  
  if (!categories || categories.length === 0) return null;

  return (
    <Html
      position={[viewport.width / 2 - 2, viewport.height / 2 - 2, 0]}
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(10px)",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "white",
        fontSize: "12px",
        maxWidth: "200px",
      }}>
      <div>
        <div style={{ fontWeight: "bold", marginBottom: "8px", textAlign: "center" }}>
          Categories
        </div>
        {categories.map((cat, index) => (
          <div
            key={cat.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "5px",
              padding: "4px",
              borderRadius: "4px",
              cursor: "pointer",
            }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: cat.color,
                boxShadow: `0 0 8px ${cat.color}`,
              }}></div>
            <span style={{ fontSize: "11px" }}>
              {cat.name} ({cat.events.length})
            </span>
          </div>
        ))}
      </div>
    </Html>
  );
}
