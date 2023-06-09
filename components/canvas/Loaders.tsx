import * as THREE from 'three'
import { useState, useRef, Suspense, useMemo, useEffect, useLayoutEffect } from 'react'
import { Canvas, useThree, useFrame, useLoader, extend } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { RigProps } from '@/props/CanvasProps'
import { gsap } from 'gsap'
import Ground from './Ground'
import MusicAmp from './MusicAmp'
import { useAudio } from './music/AudioSpectrum'


function Diamonds({color, position,scale,highFrequency }:any) {

    const ref = useRef<any>(null)
    const { paths: [path] } : any = useLoader(SVGLoader, '/bloom/triangle.svg') // prettier-ignore
    const geom1 = useMemo(() => SVGLoader.pointsToStroke(path.subPaths[0].getPoints(200), path.userData.style), [])

    const { paths: [music] } : any = useLoader(SVGLoader, '/bloom/music.svg') // prettier-ignore
    const geom2 = useMemo(() => SVGLoader.pointsToStroke(music.subPaths[0].getPoints(200), music.userData.style), [])

    return (
        <group ref={ref}>
            <mesh
                geometry={geom1}
                position={position}
                scale={scale}
            >
                <meshStandardMaterial
                    color={color} 
                    toneMapped={false} 
                    emissive={0xffffff}
                    emissiveIntensity={2}
                />
            </mesh>
            <mesh
                geometry={geom2}
                position={[position[0] + 0.05,0.9,position[2]]}
                scale={scale}
                rotation={[ Math.PI ,0,0]}
            >
                <meshStandardMaterial
                    side={THREE.DoubleSide}
                    color={color} 
                    toneMapped={false} 
                    emissive={0xffffff}
                    emissiveIntensity={2}
                />
            </mesh>
        </group>
    )
}

function Circle({...props}:any) {

    const { videoRef,loading,play } = useAudio()
    const circleRef = useRef<any>(null);

    useLayoutEffect(() => {
        let g = circleRef.current
        let z = 1.25
        let p = g.parameters;
        let hw = p.width * 0.8;
        
        let a = new THREE.Vector2(-hw, 0);
        let b = new THREE.Vector2(0, z);
        let c = new THREE.Vector2(hw, 0);
        
        let ab = new THREE.Vector2().subVectors(a, b);
        let bc = new THREE.Vector2().subVectors(b, c);
        let ac = new THREE.Vector2().subVectors(a, c);
        
        let r = Math.round((ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac))));
        
        // console.log(r)
        let center = new THREE.Vector2(0, z - r);
        let baseV = new THREE.Vector2().subVectors(a, center);
        let baseAngle = baseV.angle() - (Math.PI / 2);

        let arc = baseAngle * 2;
        
        let uv = g.attributes.uv;
        let pos = g.attributes.position;
        let mainV = new THREE.Vector2();
        console.log(uv)
        console.log(pos)
        for (let i = 0; i < uv.count; i++){
            let uvRatio = 1 - uv.getX(i);
            let y = pos.getY(i);
            mainV.copy(c).rotateAround(center, (arc * (uvRatio)));
            pos.setXYZ(i , mainV.x, y, -mainV.y);
        }
        
        pos.needsUpdate = true;
    },[circleRef])

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = 0.3
            videoRef.current.load();
            if (loading && play) {
                videoRef.current.play();
            }
        }
    }, [loading]);
    
    const texture = useMemo(() => {
        if (videoRef.current) {
            return new THREE.VideoTexture(videoRef.current);
        }
    }, [videoRef]);
    
    return (
        <>
            <mesh
            {...props}
            >
                <planeGeometry args={[2,2.5,32]}
                    ref={circleRef}
                />
                <meshStandardMaterial
                    color={0xedebeb}
                    toneMapped={false}
                    map={texture}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </>
    )
}

function Rig({ children, loading }: RigProps) {
    const ref = useRef<any>(null);
    const vec = new THREE.Vector3();
    const { camera, mouse } = useThree();

    const [animationStarted, setAnimationStarted] = useState(false);

    const lookAtStart = new THREE.Vector3(0, 1, 8);
    const lookAtMid = new THREE.Vector3(1, 1, 0);
    const lookAtEnd = new THREE.Vector3(0, 1, -8);

    const lookAtSpline = new THREE.CatmullRomCurve3([lookAtStart, lookAtMid, lookAtEnd]);

    const animationDuration = 4;
    const elapsedTimeRef = useRef<number>(0);

    useEffect(() => {
        camera.lookAt(lookAtStart);
    }, []);

    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => {
                setAnimationStarted(true);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setAnimationStarted(false);
        }
    }, [loading]);

    useFrame((state, delta) => {
        if (loading && animationStarted) {
            elapsedTimeRef.current += delta;
            const t = Math.min(elapsedTimeRef.current / animationDuration, 1);
    
            camera.position.lerpVectors(new THREE.Vector3(0, 1, 1.2), new THREE.Vector3(0, 1, 1.2), t);
    
            const currentLookAt = lookAtSpline.getPoint(t);
            camera.lookAt(currentLookAt);
    
            if (ref.current) {
                const clampedMouseY = mouse.y > 0 ? THREE.MathUtils.clamp(mouse.y, -Infinity, 0.5) : -0.5 ;
                ref.current.position.lerp(vec.set(mouse.x * 0.02, clampedMouseY * 0.1, 0), 0.005);
                ref.current.rotation.y = THREE.MathUtils.lerp(
                    ref.current.rotation.y,
                    (-mouse.x * Math.PI) / 100,
                    0.1
                );
            }
        }
    });    

    return <group ref={ref}>{children}</group>;
}



const Scene = () => {

    const {loading,highFrequency} = useAudio()

    const lightRef1 = useRef(null)
  

    const { camera, gl }:any = useThree();

    useEffect(() => {
        const onWindowResize = () => {
            if (camera) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                gl.setSize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener("resize", onWindowResize);
    }, [camera, gl, camera]);
    
    return(
    <>  
        <color attach="background" args={['black']} />
        <ambientLight ref={lightRef1} />
        {/* <OrbitControls 
            // enableZoom={false} 
            // enablePan={false} 
            // enableRotate={false} 
        /> */}

        <Suspense fallback={null}>
            <Rig
                loading={loading}
            >
                <Circle
                    position={[0,1,-0.4]}
                />
                <MusicAmp />
                <Diamonds
                    position={[-1.5,0.5,-0.4]}
                    scale={0.002}
                    highFrequency={highFrequency}
                />
                <Diamonds
                    position={[1,0.5,-0.4]}
                    scale={0.002}
                    highFrequency={highFrequency}
                />
                <Ground 
                    position={[0,0,0]} 
                    rotation={[- Math.PI / 2 , 0 , 0 ]}
                />
                <Ground 
                    position={[0,2.5,2.5]} 
                    rotation={[- Math.PI , 0 , 0 ]}
                />
                <Ground 
                    position={[-2.5,2.5,0]} 
                    rotation={[ 0 ,  Math.PI / 2 , 0 ]}
                />
                <Ground 
                    position={[-0,2.5, -2.5]} 
                    rotation={[ 0 , 0 , 0 ]}
                />
                <Ground 
                    position={[2.5,2.5, 0]} 
                    rotation={[ 0 ,  -Math.PI / 2 , 0 ]}
                />
            </Rig>
            <EffectComposer multisampling={4}>
                <Bloom kernelSize={1} luminanceThreshold={1} luminanceSmoothing={0.4} intensity={0.5} />
            </EffectComposer>
        </Suspense>
    </>
    )
}


const Loaders = () => {

    const { play,loading,playRef,pauseRef,setLoading,videoRef } = useAudio()

    const refName = useRef<HTMLDivElement>(null)
    const refSelectorName = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let tl = gsap.timeline()
        .to(refSelectorName.current,{
            "--name-height":"100%",
            duration:0.8,
            ease:"power4.inOut"
        })
        .to(refName.current,{
            translateX:0,
            opacity:1,
            duration:2,
            ease:"power4.inOut"
        })
    },[])


    const bricks = useRef<Array<HTMLSpanElement | null>>([null, null]);
    useEffect(() => {
        const tl = gsap.timeline({ repeat: 0 });
        const totalDuration = 3; // Animation should complete in 5 seconds.
        const totalProgress = 99; // 99 steps for 00% to 99%
        const stepDuration = totalDuration / totalProgress;

        for (let step = 0; step < totalProgress; step++) {
            bricks.current.forEach((brick, index) => {
                const digitIndex = 1 - index; // Reverse the index to make the last digit faster
                const newNumber = Math.floor((step + 1) / Math.pow(10, digitIndex)) % 10;
                if (brick) {
                    tl.to(
                    brick,
                        {
                            duration: stepDuration,
                            ease: 'none',
                            onComplete: () => {
                                brick.textContent = newNumber + '';
                            },
                        },
                    step * stepDuration
                    );
                }
            });
        }

        tl.to('.loader_display', { duration: 0.5, opacity: 0, display: 'none', ease: 'power2.in' }, totalDuration).then(() => {
            if (!loading) {
                setLoading(true);
            }
        });
    }, []);


    return (
        <div className="loaders">
            <video
                ref={videoRef}
                style={{ display: 'none' }}
                src="./img/shelter-cut.mp4"
                autoPlay
            />
            <div className="name" ref={refSelectorName}>
                <h4>
                    <span className="word" ref={refName}>
                        Julle Myth Vicentillo
                    </span>
                </h4>
            </div>
            <div className="loader_display">
                <h3 className="text">
                    {Array.from({ length: 2 }, (_, index) => (
                        <span key={index} className="load_text brick">
                        <span
                            className="slide"
                            ref={(el) => {
                            if (el) {
                                bricks.current[index] = el;
                            }
                            }}
                        >
                            {index === 0 ? '0' : '0'}
                        </span>
                        </span>
                    ))}
                    <span className="load_text">%</span>
                </h3>
            </div>
            
            <Canvas
                className="loaders-composition"
                camera = {{ position: [0,1,1.2] }}
                shadows gl={{ antialias: true }}
            >
                <Scene />
            </Canvas>
            <div className="play-button" style={ loading ? { display:'flex' } : {display:'none'}}>
                <svg 
                    ref={playRef} width="24" height="24" 
                    viewBox="0 0 24 24" fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={ play ? { display:'none' } : {display:"flex"}}
                >
                <path d="M12 0.333008C5.55415 0.333008 0.333313 5.55384 0.333313 11.9997C0.333313 18.4455 5.55415 23.6663 12 23.6663C18.4458 23.6663 23.6666 18.4455 23.6666 11.9997C23.6666 5.55384 18.4458 0.333008 12 0.333008ZM9.66665 17.2497V6.74967L16.6666 11.9997L9.66665 17.2497Z" fill="white"/>
                </svg>
                <svg 
                    ref={pauseRef} width="20" height="20" 
                    viewBox="0 0 20 20" fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={ play ? { display:'flex' } : {display:"none"}}
                >
                <path d="M10 0.625C8.1458 0.625 6.33324 1.17483 4.79153 2.20497C3.24982 3.23511 2.0482 4.69929 1.33863 6.41234C0.629062 8.1254 0.443406 10.0104 0.805142 11.829C1.16688 13.6475 2.05976 15.318 3.37088 16.6291C4.682 17.9402 6.35246 18.8331 8.17103 19.1949C9.9896 19.5566 11.8746 19.3709 13.5877 18.6614C15.3007 17.9518 16.7649 16.7502 17.795 15.2085C18.8252 13.6668 19.375 11.8542 19.375 10C19.3723 7.51443 18.3837 5.13145 16.6261 3.37389C14.8686 1.61633 12.4856 0.62773 10 0.625ZM10 18.625C8.29414 18.625 6.62658 18.1192 5.20821 17.1714C3.78984 16.2237 2.68435 14.8767 2.03154 13.3006C1.37874 11.7246 1.20793 9.99043 1.54073 8.31735C1.87353 6.64426 2.69498 5.10743 3.90121 3.9012C5.10744 2.69498 6.64426 1.87352 8.31735 1.54073C9.99044 1.20793 11.7246 1.37873 13.3006 2.03154C14.8767 2.68434 16.2237 3.78983 17.1714 5.20821C18.1192 6.62658 18.625 8.29414 18.625 10C18.6225 12.2867 17.713 14.4791 16.0961 16.0961C14.4791 17.713 12.2867 18.6225 10 18.625ZM8.125 7V13C8.125 13.0995 8.0855 13.1948 8.01517 13.2652C7.94484 13.3355 7.84946 13.375 7.75 13.375C7.65055 13.375 7.55517 13.3355 7.48484 13.2652C7.41451 13.1948 7.375 13.0995 7.375 13V7C7.375 6.90054 7.41451 6.80516 7.48484 6.73483C7.55517 6.66451 7.65055 6.625 7.75 6.625C7.84946 6.625 7.94484 6.66451 8.01517 6.73483C8.0855 6.80516 8.125 6.90054 8.125 7ZM12.625 7V13C12.625 13.0995 12.5855 13.1948 12.5152 13.2652C12.4448 13.3355 12.3495 13.375 12.25 13.375C12.1505 13.375 12.0552 13.3355 11.9848 13.2652C11.9145 13.1948 11.875 13.0995 11.875 13V7C11.875 6.90054 11.9145 6.80516 11.9848 6.73483C12.0552 6.66451 12.1505 6.625 12.25 6.625C12.3495 6.625 12.4448 6.66451 12.5152 6.73483C12.5855 6.80516 12.625 6.90054 12.625 7Z" fill="white"/>
                </svg>
            </div>
        </div>
    )
}

export default Loaders


