import { MouseEventHandler, useCallback, useState } from "react";
import { useEffect } from "react";

interface DialProps {
    label: string;
    width: number;
    color?: string;
    secondaryColor?: string;
    showLabel?: boolean;
    value: number;
    setValue: Function;
    minAngle?: number;
    maxAngle?: number;
}

const Dial = ({
    label,
    width,
    color,
    secondaryColor,
    showLabel,
    value,
    setValue,
    minAngle,
    maxAngle,
}: DialProps) => {
    const min = minAngle ?? 0;
    const max = maxAngle ?? 360
    if (value < 0 || value > 1) throw Error('value must be a value between [0, 1], inclusive')
    if (min < 0 || min >= max) throw Error('minPos must be above 0 and less than maxPos')
    if (max > 360) throw Error('maxPos must be under 360')
    const [angle, _setAngle] = useState(value * max);
    const setAngle = useCallback((newAngle: number) => _setAngle(
        newAngle < min ?
            min :
            newAngle > max ?
                max :
                newAngle
    ),[min, max])

    const half = width / 2;

    const handleDown: MouseEventHandler = (e) => {
        const center = { x: e.currentTarget.getBoundingClientRect().x + half, y: e.currentTarget.getBoundingClientRect().y + half };
        const handleMove = (startPos: { x: number, y: number }): EventListener => (e) => {
            if (!(e instanceof MouseEvent)) throw TypeError('handle move must use a MouseEvent')
            const dist = { x: e.clientX - center.x, y: center.y - e.clientY }
            const v = (-Math.atan2(dist.y, dist.x) / Math.PI) * 180 + 180;
            setAngle(v)
        }



        const moveRef = handleMove({ x: e.clientX, y: e.clientY })

        const handleUp: EventListener = () => {
            document.removeEventListener('mousemove', moveRef)
            document.removeEventListener('mouseup', handleUp)
        }
        document.addEventListener('mousemove', moveRef)
        document.addEventListener('mouseup', handleUp)
    }

    useEffect(() => {
        const dist = max - min
        setValue((angle - min) / dist)
    }, [angle, max, setValue, min])

    useEffect(()=>{
        setAngle(value*max)
        }, [value, max, setAngle])


    return (
        <label id={"dial-" + label} className='dial'
        >
            {showLabel ? label : ''}
            <div>
                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox={"0 0 " + width + " " + width}
                    width={width} height={width}
                    onMouseDown={handleDown}
                >
                    <g id={"dial-" + label} transform={`rotate(${angle} ${half} ${half})`}>
                        <circle
                            cx={half}
                            cy={half}
                            r={half}
                            fill={color ?? 'black'}
                        />
                        <circle
                            cx={half / 4}
                            cy={half}
                            r={half / 10}
                            fill={secondaryColor ?? 'darkGray'}
                        />
                    </g>
                </svg>
            </div>
        </label>)
}

export default Dial;
