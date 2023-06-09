import React, { useEffect, useRef, useState } from 'react'
import { useAudio } from '../canvas/music/AudioSpectrum';
import { gsap } from 'gsap';
import Image from 'next/image';
import { images } from '../utilities'


interface CircleCanvasProps {
    highlightedIndex: number;
}

const CircleCanvas: React.FC<CircleCanvasProps> = ({ highlightedIndex }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const bigRadius = 350;
        const mediumRadius = 25;
        const smallRadius = 20;

        const numCircles = 12;
        const gap = (2 * Math.PI) / numCircles;

        const circlePositions: any = [];

        for (let i = 0; i < numCircles; i++) {
        const angle = i * gap;
        const x = centerX + bigRadius * Math.cos(angle);
        const y = centerY + bigRadius * Math.sin(angle);
        circlePositions.push({ x, y });
        }

        const drawCircles = (highlightedIndex: number) => {
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
            ctx.strokeStyle = i <= highlightedIndex ? "#ffffff" : "#7f7f7f";
            ctx.stroke();
            ctx.closePath();
        }
        };

        drawCircles(highlightedIndex);
    }, [highlightedIndex]);

    return <canvas ref={canvasRef} width={800} height={800} />;
};




const SecondContainer = () => {

    const mouseRef = useRef<any>(null);
    const refWord = useRef<any>(null);
    const { loading } = useAudio()
    const sliderWrapperRef = useRef<any>(null);
    const trackRef = useRef<any>(null);
    const [mouseDownAt, setMouseDownAt] = useState<number>(0);
    const [prevPercentage, setPrevPercentage] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(0);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [dragCursorText, setDragCursorText] = useState("D R A G");


    useEffect(() => {
        const handleOnMove = (e:any) => {
            if (mouseDownAt === 0) return;
            const mouseDelta = parseFloat(mouseDownAt.toString()) - e.clientX;
            const maxDelta = Math.min(window.innerWidth * images.length, window.innerWidth / 2);
            const percentage =
                (mouseDelta / maxDelta) * -100,
                nextPercentageUnconstrained = prevPercentage + percentage,
                nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
            setPercentage(nextPercentage);

            if (trackRef.current) {
              
                const currentPercentage = prevPercentage + percentage;
                const centeredImageIndex = Math.round((-currentPercentage / 100) * (images.length - 1));
                setHighlightedIndex(centeredImageIndex);

                trackRef.current.animate({
                    transform: `translate(${nextPercentage}%, -50%)`,
                },{ 
                    duration: 2000, 
                    fill: 'forwards' 
                });
                trackRef.current.querySelectorAll('.image').forEach((elem:any,i:number) => {
                    elem.animate({
                        objectPosition: `${(250 + nextPercentage) * 0.25}% center`,
                    },{
                        duration: 2000, fill: 'forwards' 
                    })
                })
            }
        };

        window.onmousedown = (e) => setMouseDownAt(e.clientX);
        window.ontouchstart = (e) => setMouseDownAt(e.touches[0].clientX);
        window.onmouseup = () => {
            setMouseDownAt(0);
            setPrevPercentage(percentage);
        };
        window.ontouchend = (e) => {
            setMouseDownAt(0);
            setPrevPercentage(percentage);
        };
        window.onmousemove = handleOnMove;
        window.ontouchmove = handleOnMove;
        
        return () => {
            window.onmousedown = null;
            window.ontouchstart = null;
            window.onmouseup = null;
            window.ontouchend = null;
            window.onmousemove = null;
            window.ontouchmove = null;
        };
        
    }, [mouseDownAt, percentage, prevPercentage,setHighlightedIndex]);

    useEffect(() => {

        import('gsap/ScrollTrigger').then((ScrollTriggerModule) => {
            gsap.registerPlugin(ScrollTriggerModule.ScrollTrigger);
            gsap.to(refWord.current,{
                scrollTrigger: {
                    trigger: '.second-container',
                    start:"70% 80%",
                    end:"100% 100%",
                },
                translateX:0,
                opacity:1,
                duration:3,
                ease:"power4.inOut"
            })
        })

        const main = document.querySelector<any>('.second-container .content')
        gsap.set(mouseRef.current,{
            xPercent:-50,
            yPercent:-50,
            y:0,x:0,
            transformOrigin:"center center"
        })

        const xTo = gsap.quickTo(mouseRef.current,"x",{duration:0.2})
        const yTo = gsap.quickTo(mouseRef.current,"y",{duration:0.2})
        
        let x = 0, 
            y = 0;

        main.addEventListener("mousemove",(e:any) => {
            var rect = main.getBoundingClientRect()

            let newX = e.clientX - rect.x
            let newY = e.clientY - rect.y

            xTo(newX)
            yTo(newY)
            x = e.clientX;
            y = e.clientY;
        })

        function onMouseOver(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (target.closest(".second-container .image")) {
                setDragCursorText("C L I C K");
            }
        }
        
        function onMouseOut(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (target.closest(".second-container .image")) {
                setDragCursorText("D R A G");
            }
        }
        
        sliderWrapperRef.current.addEventListener("mouseover", onMouseOver);
        sliderWrapperRef.current.addEventListener("mouseout", onMouseOut);


    },[])

    return (
        <div className='second-container' style={ loading ? {display:'block'} : {display:'none' }}>
            
            <div className="pin-spacer position-relative">
                <div className="project">
                    <h2> 
                        <span className="word" ref={refWord}>
                            PROJECT
                        </span>
                    </h2>
                </div>
                <div className="content">
                    <div className="dragCursor" ref={mouseRef}>
                        {dragCursorText}
                    </div>
                    <div className="main-side flex items-center justify-center">
                        <CircleCanvas highlightedIndex={highlightedIndex} />
                        <div className="imgWrapper" ref={sliderWrapperRef}>
                            <div id="image-track" data-mouse-down-at={mouseDownAt} data-prev-percentage={prevPercentage} ref={trackRef}>
                                {images.map((elem,i) => {
                                    return (
                                        <div 
                                            className="image_screen" 
                                            key={i}
                                            draggable={false}
                                        >
                                            <a
                                            href={elem.links} 
                                            >
                                                <Image
                                                    src={elem.url}
                                                    alt=''
                                                    width={1500}
                                                    height={1500}
                                                    className='image'
                                                />
                                            </a>
                                        </div>
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