
export type LoadingProps = {
    loadingState: boolean;
    setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
    loadingCount: number;
    setLoadingCount: React.Dispatch<React.SetStateAction<number>>;
} 

export type AudioProps = {
    videoRef:  React.MutableRefObject<HTMLVideoElement | null>;
    play: boolean;
    setPlay: React.Dispatch<React.SetStateAction<boolean>>
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    pauseRef: React.MutableRefObject<any>;
    playRef: any;
    setHighestFrequency: React.Dispatch<React.SetStateAction<number>>
    highFrequency:number;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    animationIds: React.MutableRefObject<number[]>;
    audioCtx:React.MutableRefObject<AudioContext | null>
    analyser: React.MutableRefObject<AnalyserNode | null>
    bufferLength: React.MutableRefObject<number>;
    dataArray: React.MutableRefObject<Uint8Array>
    numBars: number;
    barRefs:React.MutableRefObject<React.RefObject<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>[]>

} 