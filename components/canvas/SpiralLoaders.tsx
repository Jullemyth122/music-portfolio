import { Text, useProgress } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three'

interface SpiralProps {
    position: number[];
    rotation: number[];
    thetaRatioUniform: React.MutableRefObject<THREE.IUniform | undefined>;
    startTime: React.MutableRefObject<number>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    amount: number;
    size: number
}

const SpiralPlane: React.FC<SpiralProps> = ({
    loading,
    setLoading,
    thetaRatioUniform,
    startTime,
    position,
    rotation,
    amount = 10,
    size = 1
}) => {

    const { progress } = useProgress()

    const textRef = useRef<any>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const [opacity, setOpacity] = useState(1);

    const animationComplete = useRef<boolean>(false);
    const { clock } = useThree();
    const [percentage, setPercentage] = useState(0);


    useFrame(() => {
        // const elapsedTime = (Date.now() - startTime.current) / 1000;
        const thetaRatio = progress / 100;
        setPercentage(Math.floor(thetaRatio * 100));

        if (thetaRatioUniform.current) {
            thetaRatioUniform.current.value = thetaRatio;
            if (thetaRatio === 1 && !animationComplete.current) {
                setLoading(true);
                animationComplete.current = true;
            }
        }
    });

    useEffect(() => {
        if (loading) {
            const fadeDuration = 1;
            const fadeStartTime = clock.getElapsedTime();

            const fadeAnimation = () => {
                const elapsedTime = clock.getElapsedTime() - fadeStartTime;
                const progress = Math.min(elapsedTime / fadeDuration, 1);
                setOpacity(1 - progress);

                if (progress < 1) {
                requestAnimationFrame(fadeAnimation);
                }
            };

            fadeAnimation();
        }

        // Cleanup function
        return () => {

            if (textRef.current) {
                textRef.current.geometry.dispose();
                textRef.current.material.dispose();
            }
        
            // Dispose of the geometry
            meshRef.current?.geometry.dispose();
            // Check if the material property is an array or a single material
            if (Array.isArray(meshRef.current?.material)) {
                // Dispose of each material in the array
                meshRef.current?.material.forEach((material) => {
                    material.dispose();
                });
            } else {
                // Dispose of the single material
                meshRef.current?.material.dispose();
            }
        
            // If the material has a texture, dispose of it as well
            if (meshRef.current?.material instanceof THREE.MeshBasicMaterial) {
                meshRef.current.material.map?.dispose();
            }
        };
    }, [loading, clock]);

    return (
        <>
            <Text
                ref={textRef}
                position={new THREE.Vector3(...position)}
                rotation={[0, -Math.PI, 0]}
                lineHeight={1.3}
                font='/FogtwoNo5.otf'
                fontSize={ 0.2 }
                material-toneMapped={false}
                anchorX='center'
                anchorY='middle'
                fillOpacity={opacity}
                strokeOpacity={opacity}
            >
            {percentage}% 
            </Text>
            <mesh ref={meshRef} position={new THREE.Vector3(...position)} rotation={new THREE.Euler(...rotation)}>
            <planeGeometry args={[1, 1, 100, 100]} />
            <meshBasicMaterial
                color={0xffffff}
                opacity={opacity}
                transparent={true}
                shadowSide={THREE.DoubleSide}
                side={THREE.DoubleSide}
                onBeforeCompile={(shader) => {
                thetaRatioUniform.current = shader.uniforms.thetaRatio = { value: 0 };
                shader.uniforms.radiusMin = { value: 0.385 };
                shader.uniforms.radiusMax = { value: 0.4 };
                shader.vertexShader = `
                    uniform float thetaRatio;
                    uniform float radiusMin;
                    uniform float radiusMax;
                    ${shader.vertexShader}
                `.replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>
                    float angle = uv.y * PI2 * thetaRatio;
                    float radius = radiusMin + (radiusMax - radiusMin) * uv.x;
                    transformed.x = cos(angle) * radius;
                    transformed.y = sin(angle) * radius;
                    `
                );
                }}
            />
            </mesh>
        
        </>
    );
};

export default SpiralPlane;
