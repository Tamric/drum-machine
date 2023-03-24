import { MouseEventHandler } from "react"

interface ToggleProp {
    on: boolean;
    label?: string;
    showText?: boolean;
    onClick: MouseEventHandler;
    invertSwitch?: boolean;
}

const Toggle = (props: ToggleProp) => {

    return (
        <label className="toggleLabel">
            {props.label}
            <div className="outerToggle" onClick={props.onClick} >
                <div
                    className={"innerToggle " +
                        (props.invertSwitch ?
                            (props.on ? 'on' : 'off') :
                            (props.on ? 'off' : 'on')
                        )}>
                    {props.showText ? props.on ? 'ON' : 'OFF' : ''}
                </div>
            </div>
        </label>)
}

export default Toggle;
