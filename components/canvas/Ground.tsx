import { MeshReflectorMaterial, useTexture } from '@react-three/drei'
import { LinearEncoding, RepeatWrapping, TextureLoader } from 'three'

import * as THREE from 'three'

import React, { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'

type GroundProps = {
  rotation: number[];
  position: number[];
}

const Ground: React.FC<GroundProps> = ({ position,rotation }) => {

    const [roughness,normal] = useLoader(TextureLoader,[
        "./bloom/surface_texture.jpg",
        "./bloom/surface_normal.jpg",
    ])

    useEffect(() => {
        [normal,roughness].forEach((t) => {
            t.wrapS = RepeatWrapping
            t.wrapT = RepeatWrapping
            t.repeat.set(5,5)
        })
        normal.encoding = LinearEncoding
    },[normal,roughness])

    return (
        <>
            <mesh 
                rotation={new THREE.Euler(...rotation)}
                position={new THREE.Vector3(...position)}
            >
                <planeGeometry args={[5,5]}/>
                {/* <boxGeometry args={[5,5,5]}/> */}
                <MeshReflectorMaterial
                    envMapIntensity={0}
                    normalMap={normal}
                    roughnessMap={roughness}
                    dithering={true}
                    color={[0.015,0.015,0.015]}
                    roughness={0.4}
                    opacity={1}
                    blur={[1000,400]}
                    mixBlur={30}
                    transparent={true}
                    mixStrength={40}
                    mixContrast={1}
                    resolution={1024}
                    mirror={0}
                    side={THREE.DoubleSide}
                    depthScale={0.01}
                    minDepthThreshold={0.9}
                    maxDepthThreshold={1}
                    depthToBlurRatioBias={0.25}
                    reflectorOffset={0.2}
                />
            </mesh>
        </>
    )
}

export default Ground