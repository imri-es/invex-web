import React, { useState } from "react";

import "./floatInput.css";

interface FloatLabelProps {
    children: React.ReactNode;
    label: string;
    value?: any;
    [key: string]: any;
}

const FloatLabel: React.FC<FloatLabelProps> = (props) => {
    const [focus, setFocus] = useState(false);
    const [isAutofilled, setIsAutofilled] = useState(false);
    const { children, label, value, ...restProps } = props;

    // We check if value exists or if the browser has triggered autofill animation
    const labelClass =
        focus || (value !== undefined && value !== null && value !== '') || isAutofilled ? "label label-float" : "label";

    const handleAnimationStart = (e: React.AnimationEvent<HTMLDivElement>) => {
        if (e.animationName === 'onAutoFillStart') {
            setIsAutofilled(true);
        } else if (e.animationName === 'onAutoFillCancel') {
            setIsAutofilled(false);
        }
    };

    return (
        <div
            className="float-label"
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            onAnimationStart={handleAnimationStart}
        >
            {React.cloneElement(children as React.ReactElement<any>, {
                value: value,
                ...restProps
            })}
            <label className={labelClass}>{label}</label>
        </div>
    );
};

export default FloatLabel;
