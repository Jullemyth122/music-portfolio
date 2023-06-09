import React, { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import { useAudio } from './music/AudioSpectrum';

const MusicAmp = () => {
    const { analyser,bufferLength,dataArray,numBars,barRefs } = useAudio()

    let barWidth:number = 0.005; // Adjusted barWidth
    let gap:number = 0.020; // Adjusted gap
    
    const smoothingFactor = 0.085;
    
    useFrame(() => {
        if (analyser.current && bufferLength.current > 0) {
            analyser.current.getByteFrequencyData(dataArray.current);
            const half = Math.ceil(numBars / 2);
            let maxFrequency = 0;
    
            for (let i = 0; i < half; i++) {
                const barHeight = dataArray.current[i] / 256;
    
                maxFrequency = Math.max(maxFrequency, barHeight);
    
                const leftBar = barRefs.current[half - i - 1]?.current;
                if (leftBar) {
                    const targetScaleY = barHeight * 3 || 0.1;
                    leftBar.scale.y += (targetScaleY - leftBar.scale.y) * smoothingFactor;
                }
    
                const rightBar = barRefs.current[half + i]?.current;
                if (rightBar) {
                    const targetScaleY = barHeight * 3 || 0.1;
                    rightBar.scale.y += (targetScaleY - rightBar.scale.y) * smoothingFactor;
                }
            }
        }
    });
    



    return (
        <>
            <group position={[0, 0, -0.2]}>
            {Array(numBars)
                .fill(null)
                .map((_, i) => {
                const half = Math.ceil(numBars / 2);
                const position = i < half
                    ? [
                        -(half - i) * (barWidth + gap) + gap / 2,
                        0.35,
                        0
                    ]
                    : [
                        (i - half) * (barWidth + gap) + gap / 2,
                        0.35,
                        0
                    ];

                return (
                    <mesh key={i} ref={barRefs.current[i]} position={new THREE.Vector3(...position)}>
                    <boxGeometry args={[barWidth, 0.1, barWidth]} />
                    <meshStandardMaterial 
                        color={0x3268a8} 
                        toneMapped={false}
                        emissive={0xffffff}
                        emissiveIntensity={1}
                    />
                    </mesh>
                );
                })}
            </group>
        </>
    );
};

export default MusicAmp;
