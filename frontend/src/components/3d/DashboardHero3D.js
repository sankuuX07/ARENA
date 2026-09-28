import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
const AnimatedOrb = () => {
    const meshRef = useRef(null);
    useFrame((_state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });
    return (_jsx(Float, { speed: 2, rotationIntensity: 1, floatIntensity: 1, children: _jsx(Sphere, { ref: meshRef, args: [1.5, 64, 64], children: _jsx(MeshDistortMaterial, { color: "#6366f1", attach: "material", distort: 0.4, speed: 2, roughness: 0.2, metalness: 0.8 }) }) }));
};
export const DashboardHero3D = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return null; // Fallback to no 3D animation if reduced motion preferred
    }
    return (_jsx("div", { style: { height: 200, width: 200, position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }, children: _jsxs(Canvas, { camera: { position: [0, 0, 5], fov: 45 }, children: [_jsx("ambientLight", { intensity: 0.8 }), _jsx("directionalLight", { position: [10, 10, 5], intensity: 1, color: "#d946ef" }), _jsx("directionalLight", { position: [-10, -10, -5], intensity: 1, color: "#06b6d4" }), _jsx(AnimatedOrb, {})] }) }));
};
//# sourceMappingURL=DashboardHero3D.js.map