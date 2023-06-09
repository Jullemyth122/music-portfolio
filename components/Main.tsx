import React, { useEffect, useRef } from 'react'
import Globals from '.'
import { GlobalProvider } from './context/GlobalProvider'
import { AudioSpectrum } from './canvas/music/AudioSpectrum'
import Lenis from '@studio-freight/lenis';
import Container from './containers/Container';
import SecondContainer from './containers/SecondContainer';

const Main = () => {

    return (
        <main>
            <GlobalProvider>
                <AudioSpectrum>
                    <Globals/>
                    {/* <div className="scroll-home">
                        <Container/>
                        <SecondContainer/>
                    </div> */}
                </AudioSpectrum>
            </GlobalProvider>
        </main>
    )
}

export default Main