import { AudioProps } from '@/props/ContextProps';
import React, { useEffect, useMemo, useRef,createContext,useContext, useState } from 'react'
import * as THREE from 'three'

const AudioContext = createContext<AudioProps>(
    {} as AudioProps
);

const AudioSpectrum:React.FC<{ children:any }> = ({ children }) => {
    const playRef = useRef<any>(null)
    const videoRef = useRef<any>(null)
    const pauseRef = useRef<any>(null)
    const audioRef = useRef<HTMLAudioElement>(null)
    const [play,setPlay] = useState(false)
    const [loading,setLoading] = useState(false)
    const [highFrequency,setHighestFrequency] = useState<number>(0)

    const animationIds = useRef<number[]>([]);
    const audioCtx = useRef<AudioContext | null>(null);
    const analyser = useRef<AnalyserNode | null>(null);
    const bufferLength = useRef<number>(0);
    const dataArray = useRef<Uint8Array>(new Uint8Array(0));

    const numBars = useMemo(() => (bufferLength.current > 0 ? bufferLength.current : 64), [bufferLength.current]);
    const barRefs = useRef<Array<React.RefObject<THREE.Mesh>>>(Array(numBars).fill(null).map(() => React.createRef<THREE.Mesh>()));
    const audioSource = useRef<MediaElementAudioSourceNode | null>(null);

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const plays = playRef.current;
        const pauses = pauseRef.current;
        let audio1 = videoRef.current;

        if (audio1) {
            audio1.volume = 1.0;
            audio1.crossOrigin = 'anonymous';
            pauses.addEventListener('click', () => {
                setPlay(false);
                audio1?.pause();
                cancelAnimationFrame(animationIds.current[0]);

                if (analyser.current && isConnected) {
                    if (audioCtx.current) {
                    analyser.current.disconnect(audioCtx.current.destination);
                    setIsConnected(false);
                    }
                }
            });

            plays.addEventListener('click', () => {
                setPlay(true);
                audio1?.play();

                if (audio1 !== null) {
                    if (!audioCtx.current) {
                        audioCtx.current = new window.AudioContext();
                    }

                    if (!audioSource.current) {
                        audioSource.current = audioCtx.current.createMediaElementSource(videoRef.current);
                    }

                    if (!analyser.current) {
                        analyser.current = audioCtx.current.createAnalyser();
                    } else {
                    // Disconnect the analyser node from the audio source before reconnecting
                        audioSource.current.disconnect(analyser.current);
                    }

                    audioSource.current.connect(analyser.current);
                    analyser.current.connect(audioCtx.current.destination);
                    analyser.current.fftSize = 128;
                    bufferLength.current = analyser.current.frequencyBinCount;
                    dataArray.current = new Uint8Array(bufferLength.current);

                    setIsConnected(true);
                }
            });
        }
    }, []);


    useEffect(() => {
        if (barRefs.current) {
            barRefs.current = Array(numBars)
                .fill(null)
                .map((_, i) => barRefs.current[i] || React.createRef<THREE.Mesh>());
        }
    }, [numBars]);

    const value = {
        videoRef,
        play, setPlay, 
        audioRef, pauseRef, playRef,
        setHighestFrequency,highFrequency,
        loading,setLoading,
        animationIds,
        audioCtx,
        analyser,
        bufferLength,
        dataArray,
        barRefs,
        numBars
    }

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    )
}

const useAudio = () => {
    const data = useContext(AudioContext);
    return { ...data };
};

export { AudioSpectrum, useAudio };