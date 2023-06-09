import React, { useEffect, useRef } from 'react'
import Loaders from './canvas/Loaders'
import { useGlobal } from './context/GlobalProvider'
import gsap from 'gsap'

const Globals = () => {

    const { loadingState } = useGlobal()
    const mouseRef = useRef<any>(null);
    const mainComponentRef = useRef<any>(null);

    useEffect(() => {
        const playButton = document.querySelector<any>(".play-button");

        const main = document.querySelector<any>('.main-component')

        gsap.set(mouseRef.current,{
            xPercent:-50,
            yPercent:-50,
            y:0,x:0,
            transformOrigin:"center center"
        })

        gsap.set(".mouseCursor .rotate",{transformOrigin:"50% 50%"})
        const rotateTween = gsap.to('.mouseCursor .rotate',{duration:0.5,paused:true})
        const xTo = gsap.quickTo(mouseRef.current,"x",{duration:0.3})
        const yTo = gsap.quickTo(mouseRef.current,"y",{duration:0.3})
        
        const RAD2DEG = 180 / Math.PI;

        let x = 0, 
            y = 0;

        main.addEventListener("mousemove",(e:any) => {
            var rect = main.getBoundingClientRect()
            let xDif = e.clientX - x
            let yDif = e.clientY - y

            let newX = e.clientX - rect.x
            let newY = e.clientY - rect.y

            xTo(newX)
            yTo(newY)
            x = e.clientX;
            y = e.clientY;

            rotateTween.vars.rotation = (Math.atan2(yDif, xDif) * RAD2DEG - 40) + "_short";

            rotateTween.invalidate().restart();
            // }
        })

        mainComponentRef.current.addEventListener("mouseleave",(e: MouseEvent) => {
            gsap.to(mouseRef.current,{
                "--cursor-c":'0px',
                display:'none',
                duration:0.7,
                ease:"power2.inOut",
            })
        })

        mainComponentRef.current.addEventListener("mouseover",(e: MouseEvent) => {
            gsap.to(mouseRef.current,{
                "--cursor-c":'50px',
                duration:0.7,
                display:'flex',
                ease:"power2.inOut",
            })
        })

        
        playButton?.addEventListener("mouseleave",(e:any) => {
            gsap.to(mouseRef.current,{
                scale:'1',
                backgroundColor:'transparent',
                '--mix-blend-background-color':'none',
                duration:0.7,
                ease:"power2.inOut",
            })
        })
        playButton?.addEventListener("mouseover",(e:any) => {
            gsap.to(mouseRef.current,{
                scale:'1.5',
                backgroundColor:'white',
                '--mix-blend-background-color':'difference',
                duration:0.7,
                ease:"power2.inOut",
            })
        })

    },[])

    return (
        <div className='main-component' ref={mainComponentRef}>
            <div className="mouseCursor" ref={mouseRef}>
                <svg className='rotate' width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M58.5 150C58.5 99.4659 99.4659 58.5 150 58.5C200.534 58.5 241.5 99.4659 241.5 150C241.5 200.534 200.534 241.5 150 241.5C99.4659 241.5 58.5 200.534 58.5 150ZM150 62.5C101.675 62.5 62.5 101.675 62.5 150C62.5 198.325 101.675 237.5 150 237.5C198.325 237.5 237.5 198.325 237.5 150C237.5 101.675 198.325 62.5 150 62.5Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M148 60V0L151 0V60H148Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M148 300V240H151V300H148Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M60 152H0L0 149H60V152Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M300 152H240V149H300V152Z" fill="white"/>
                </svg>
            </div>
            {!loadingState && <Loaders/>}
        </div>
    )
}

export default Globals