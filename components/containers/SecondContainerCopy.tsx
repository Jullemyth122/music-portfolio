import React, { useEffect, useRef } from 'react'
import { useAudio } from '../canvas/music/AudioSpectrum';
import { gsap } from 'gsap';
import Image from 'next/image';
import { images } from '../utilities'
import { Draggable } from 'gsap/all';

const CircleCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const bigRadius = 350;
        const mediumRadius = 25;
        const smallRadius = 20;

        const numCircles = 25;
        const gap = 2 * Math.PI / numCircles;

        const circlePositions:any = [];

        for (let i = 0; i < numCircles; i++) {
            const angle = i * gap;
            const x = centerX + bigRadius * Math.cos(angle);
            const y = centerY + bigRadius * Math.sin(angle);
            circlePositions.push({ x, y });
        }

        const drawCircles = (
            highlightedIndex: number,
            highlightProgress: number
        ) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 1;

            for (let i = 0; i < numCircles; i++) {
            const { x, y } = circlePositions[i];

            ctx.beginPath();
            ctx.arc(x, y, smallRadius, 0, Math.PI * 2);
            ctx.strokeStyle = i <= highlightedIndex ? "#ffffff" : "#7f7f7f";
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(x, y, mediumRadius, 0, Math.PI * 2);
            ctx.strokeStyle = i <= highlightedIndex ? "#ffffff" : "#7f7f7f";
            ctx.stroke();
            ctx.closePath();

            ctx.fillStyle = i <= highlightedIndex ? "#ffffff" : "#7f7f7f";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "16px Arial";
            ctx.fillText((i + 1).toString(), x, y);

            const startCircle = circlePositions[i];
            const endCircle = circlePositions[(i + 1) % numCircles];

            const startAngle =
                Math.atan2(startCircle.y - centerY, startCircle.x - centerX) +
                Math.asin(mediumRadius / bigRadius);
            const endAngle =
                Math.atan2(endCircle.y - centerY, endCircle.x - centerX) -
                Math.asin(mediumRadius / bigRadius);

            ctx.beginPath();
            ctx.arc(centerX, centerY, bigRadius, startAngle, endAngle);
            ctx.strokeStyle =
                i < highlightedIndex || (i === highlightedIndex && highlightProgress > 0.5)
                ? "#ffffff"
                : "#7f7f7f";
            ctx.stroke();
            ctx.closePath();
            }
        };

        const tl = gsap.timeline({ repeat: -1 });

        for (let i = 0; i < numCircles; i++) {
            const progressProxy = { progress: 0 };
            tl.add(
                gsap.to(progressProxy, {
                duration: 1,
                onUpdate: () => {
                    drawCircles(i, progressProxy.progress);
                },
                })
            );
        }
      
        drawCircles(-1, 0);
    }, []);


    return <canvas ref={canvasRef} width={800} height={800} />;
};



const SecondContainer = () => {

    const { loading } = useAudio()

    const sliderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!sliderRef.current) return;

        gsap.registerPlugin(Draggable);

        const snap = (value:any) => {
        return Math.round(value / 800) * 800;
        };

        Draggable.create(sliderRef.current, {
        type: 'x',
        edgeResistance: 0.8,
        bounds: { minX: -800 * (images.length - 1), maxX: 0 },
        throwProps: true,
        snap: {
            x: snap,
        },
        onDragEnd: function () {
            gsap.to(this.target, {
            x: snap(this.endX),
            duration: 0.5,
            ease: 'power4.out',
            });
        },
        });
    }, []);

    return (
        <div className='second-container' style={ loading ? {display:'block'} : {display:'none' }}>
            <div className="pin-spacer">
                <div className="content">
                    <div className="main-side flex items-center justify-center">
                        <CircleCanvas/>
                        <div className="imgWrapper">
                            <div className="imgList" ref={sliderRef}>
                                {images.map((elem,i) => {
                                    console.log(elem.url)
                                    return (
                                        <Image
                                            src={elem.url}
                                            key={i}
                                            alt=''
                                            width={800}
                                            height={800}
                                            className='img_count'
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="slideshows">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SecondContainer