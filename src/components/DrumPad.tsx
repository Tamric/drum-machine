import { FocusEventHandler, MouseEventHandler, useEffect, useRef, useCallback } from "react";

interface DrumProps {
    id: string;
    className?: string;
    text: string;
    src: string;
    onClick?: MouseEventHandler;
    onKeydown?: EventListener;
    onKeyUp?: EventListener;
    sustain: boolean;
    mute: boolean;
    volume?: number;
    playback: number;
    pPitch: boolean;
}

const DrumPad = ({
    id,
    className,
    text,
    src,
    onClick,
    onKeydown,
    onKeyUp,
    sustain,
    mute,
    volume,
    playback,
    pPitch,
}: DrumProps) => {
    if(volume && (volume < 0 || volume > 1)) throw Error('volume must be between [0,1] inclusive')
    if(playback && (playback < 0 || playback > 1)) throw Error('playback must be between [0,1] inclusive')
    const ref = useRef<HTMLAudioElement>(new Audio())

    const setPress = (e: Event) => {
        if (e && e.target) {
            const elm = e.target as HTMLElement;
            if (elm.parentElement)
                elm.parentElement.classList.add('pressed')
        }
    }
        ;

    const removePress = (e: Event) => {
        if (e && e.target) {
            const elm = e.target as HTMLElement;
            if (elm.parentElement)
                elm.parentElement.classList.remove('pressed')
        }
    }
        ;

    const handleClick: MouseEventHandler = async (e) => {
        if (onClick) onClick(e)
        if (mute !== true) ref.current.play();
    }

    const handleOff: MouseEventHandler= async (e) => {
        if (sustain !== true) {
            ref.current.pause()!
            ref.current.currentTime = 0;
        }
    }
    const handleKeyDown = useCallback(async (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === id.toLowerCase()) {
            if (onKeydown) onKeydown(e)
            if (mute !== true) ref.current.play();
        }
    }, [onKeydown, mute, id])


    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.key.toLowerCase() !== id.toLowerCase()) return;
        if (onKeyUp) onKeyUp(e);
        if (sustain !== true) {
            if (onKeyUp) onKeyUp(e);
            ref.current.pause();
            ref.current.currentTime = 0;
        }
    }, [onKeyUp, id, sustain,ref])
    
    useEffect(()=>{
        ref.current.preservesPitch= pPitch;
        }, [pPitch])

    useEffect(()=>{
        
        ref.current.playbackRate = 
            3.75*(playback <  0 || playback > 1? //playback is normalized, this denormalizes it
            (1/3.75): playback)+.25;
        }, [playback])



    useEffect(()=>{
    ref.current.volume = volume && //exists
        volume < 1 && //valid, when below 1
        volume >= 0 ?  //valid when above 0
        volume : 1; //if valid, give volume. Otherwise leave normal volume
    },[volume])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        ref.current.addEventListener('play', setPress)
        ref.current.addEventListener('pause', removePress)
        return () => { //remove on remount, avoid memory leaks
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [handleKeyUp, handleKeyDown])

    /**
     * In the future, I would add source to an audio reference
     * This solution is to accomedate the specific tests within freeCodeCamp
     */
    return (
        <button
            className={"drum-pad " + (className ?? '')}
            type="button"
            onClick={handleClick}
            onMouseOut={handleOff}
            key={id}
            id={id}
        >

            <audio ref={ref} className='clip' id={id} src={src}/>
            {text}
        </button>
    )
}

export default DrumPad;
