import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
// Generate random points in a sphere for the particles
const generateParticles = (count) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = 10 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
};
const ParticleCloud = () => {
    const ref = useRef(null);
    const sphere = generateParticles(1500);
    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });
    return (_jsx("group", { rotation: [0, 0, Math.PI / 4], children: _jsx(Points, { ref: ref, positions: sphere, stride: 3, frustumCulled: false, children: _jsx(PointMaterial, { transparent: true, color: "#6366f1", size: 0.05, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending }) }) }));
};
export const AuthBackground3D = () => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return _jsx("div", { className: "absolute inset-0 bg-dark opacity-50" });
    }
    return (_jsx("div", { style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none' }, children: _jsxs(Canvas, { camera: { position: [0, 0, 15], fov: 60 }, children: [_jsx("fog", { attach: "fog", args: ['#0b0f19', 10, 25] }), _jsx(ParticleCloud, {})] }) }));
};
//# sourceMappingURL=AuthBackground3D.js.map