import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useAudio } from '../canvas/music/AudioSpectrum'
import { gsap } from 'gsap';


const Container = () => {

    const shallowContentRef = useRef<any>(null)
    const profileRef = useRef<any>(null)
    const layerRef1 = useRef<any>(null)
    const layerRef2 = useRef<any>(null)
    const containerBlockRef = useRef<any>(null)
    const [cursorAllow,setCursorAllow] = useState(false)

    const { loading } = useAudio()

    useEffect(() => {
        if (loading) {
            // Dynamically import the ScrollTrigger plugin
            import('gsap/ScrollTrigger').then((ScrollTriggerModule) => {
                // Register the ScrollTrigger plugin with GSAP
                gsap.registerPlugin(ScrollTriggerModule.ScrollTrigger);
    
                // Your ScrollTrigger-related code goes here
                const scaleUpImage = () => {
                    gsap.to(profileRef.current, {
                        scrollTrigger: {
                            trigger: '.container-block',
                            start:"50% 60%",
                            end:"100% 100%",
                        },
                        scale: 1,
                        duration: 2, // Set the duration for the animation
                        ease: 'sine.inOut', // Set the easing for the animation
                    });
                };
    
                const animateText = () => {
                    gsap.to(layerRef1.current, {
                        scrollTrigger: {
                            trigger: '.container-block',
                            start:"50% 60%",
                            end:"100% 100%",
                        },
                        y: '0%',
                        opacity:1,
                        visibility: 'visible',
                        duration: 2, // Set the duration for the animation
                        ease: 'sine.inOut', // Set the easing for the animation
                    });
    
                    gsap.to(layerRef2.current, {
                        scrollTrigger: {
                        trigger: '.container-block',
                        start:"50% 60%",
                        end:"100% 100%",
                        },
                        visibility: 'visible',
                        opacity:1,
                        y: '0%',
                        duration: 2, // Set the duration for the animation
                        ease: 'sine.inOut', // Set the easing for the animation
                    });
                };

                const increaseCursor = () => {
                    gsap.to(shallowContentRef.current,{
                        scrollTrigger: {
                            trigger: '.container-block',
                            start:"50% 60%",
                            end:"100% 100%",
                        },
                        "--increase":"10%",
                        delay:1.2,
                        duration: 2, // Set the duration for the animation
                        ease: 'sine.inOut', // Set the easing for the animation
                        onComplete: () => {
                            setCursorAllow(true)
                        }
                    })
                }
    
                scaleUpImage();
                animateText();
                increaseCursor();
            });

            const hero = document.querySelector('[data-hero]')
            const containerRef = document.querySelector<any>('.container-block')
            containerRef.addEventListener('mousemove', (e:any) => {
                var rect = containerRef.getBoundingClientRect()
                const { clientX, clientY } = e
                const x = clientX - rect.x
                const y = clientY - rect.y
                gsap.to(hero, {
                    '--x': `${x}px`,
                    '--y': `${y}px`,
                    duration: 1.0,
                    ease: 'power4.out'
                })

            })

            containerBlockRef.current.addEventListener("mouseover",(e:any) => {

            })

        }
    }, [loading,setCursorAllow]);
    
    const handleMouseOver = (e:any) => {
        if (loading && cursorAllow) {
            gsap.to(shallowContentRef.current,{
                "--increase":"10%",
                duration: 1, // Set the duration for the animation
                // delay: loading ? 
                ease: 'power4.inOut', // Set the easing for the animation
            })
        }
    }
    const handleMouseLeave = (e:any) => {
        if (loading && cursorAllow) {
            gsap.to(shallowContentRef.current,{
                "--increase":"0%",
                duration: 1, // Set the duration for the animation
                ease: 'power4.inOut', // Set the easing for the animation
            })
        }
    }
 
    return (
        <div className='container-block' 
            onMouseOver={handleMouseOver}  
            onMouseLeave={handleMouseLeave}  
            ref={containerBlockRef} 
            style={ loading ? {display:'flex'} : {display:'none' }}
        >
            <div className="first-content">
                <Image
                    src='/img/us.jpg'
                    alt='Image'
                    width={400}
                    height={800}
                    className='profile-img'
                    ref={profileRef}
                />
                <div className="text-wrapper">
                    <div className="layer">
                        <h2>
                            <span className="spacer tp" ref={layerRef1}>
                            JULLEMYTH
                            </span>
                        </h2>
                    </div>
                    <div className="layer">
                        <h2>
                            <span className="spacer bt" ref={layerRef2}>
                            VICENTILLO
                            </span>
                        </h2>
                    </div>
                </div>
            </div>
            <div className="first-content shallow-content" ref={shallowContentRef} data-hero>
                <Image
                    src='/img/us.jpg'
                    alt='Image'
                    width={400}
                    height={800}
                    className='profile-img'
                />
                <div className="text-wrapper">
                    <div className="layer">
                        <h2>
                            3D WEB DEV
                        </h2>
                    </div>
                    <div className="layer">
                        <h2>
                            AUTOMATION
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Container