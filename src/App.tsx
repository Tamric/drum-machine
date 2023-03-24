import './App.css';
import { useEffect } from 'react'

import DrumPad from './components/DrumPad';
import Toggle from './components/Toggle';

import KICK_N_HAT from './assets/Kick_n_Hat.mp3'
import RP4_KICK from './assets/RP4_KICK_1.mp3'
import CEV_H2 from './assets/Cev_H2.mp3'
import DSC_OH from './assets/Dsc_Oh.mp3'
import H1 from './assets/Heater-1.mp3'
import H2 from './assets/Heater-2.mp3'
import H3 from './assets/Heater-3.mp3'
import H4 from './assets/Heater-4_1.mp3'
import H6 from './assets/Heater-6.mp3'
import { useState } from 'react';
import Dial from './components/Dial';

function App() {
    const [mute, setMute] = useState(false);
    const [sustain, setSustain] = useState(true);
    const [preservePitch, setPreservePitch] = useState(true);
    const [showName, setShow] = useState(true);
    const [volume, setVolume] = useState(0);
    const [playback, setPlayback] = useState(1 / 3.75);
    const [lastPressed, setLast] = useState('');

    const audioData = [
        { key: 'Q', src: KICK_N_HAT },
        { key: 'W', src: RP4_KICK },
        { key: 'E', src: CEV_H2 },
        { key: 'A', src: DSC_OH },
        { key: 'S', src: H1 },
        { key: 'D', src: H2 },
        { key: 'Z', src: H4 },
        { key: 'X', src: H6 },
        { key: 'C', src: H3 },
    ]

    useEffect(() => {
        if (mute) setVolume(0)
    }, [volume, setVolume, mute])

    return (
        <>
            <div className='wrapper'>
                <div id="pads">
                    {audioData.map(data =>
                        <DrumPad key={data.key} id={data.key} text={data.key}
                            src={data.src} sustain={sustain}
                            mute={mute} volume={volume}
                            playback={playback} pPitch={preservePitch}
                            setName={(name: string) => setLast(name)}
                        />)}
                </div>
                <div id='additionalControls'>
                    <div className='tray'>
                        <Toggle on={mute} label={"Mute"} showText={true} onClick={() => setMute(!mute)} />
                        <Toggle on={sustain} label={"Sustain"} showText={true} onClick={() => setSustain(!sustain)} />
                        <Toggle on={preservePitch} label={"Preserve Pitch"} showText={true} onClick={() => setPreservePitch(!preservePitch)} />
                        <Toggle on={showName} label={"Display File Played"} showText={true} onClick={() => setShow(!showName)} />
                    </div>
                    <div className='tray'>
                        <Dial value={volume} setValue={setVolume} minAngle={0} maxAngle={300} showLabel={true} label='Volume' width={50} />
                        <button onClick={() => setVolume(1)}>Reset Volume</button>
                        <Dial value={playback} setValue={setPlayback} minAngle={0} maxAngle={300} showLabel={true} label='Playback Speed' width={50} />
                        <button onClick={() => { console.log('yes'); setPlayback(1 / 3.75) }}>Reset Playback</button>
                    </div>
                </div>
            </div>
            <div id='display'>
                {showName && lastPressed}
            </div>
        </>
    );
}

export default App;
