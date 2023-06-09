
export type GroundProps = {
    mirror: number; 
    blur: number[]; 
    mixBlur: number; 
    mixStrength: number; 
    rotation: number[]; 
    position: number[];
}

export type RigProps = {
    children: React.ReactNode;
    loading: boolean;
}

export type CircleProps = {
    color?: [number, number, number];
    scale?: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
    toneMapped?: boolean;
};

