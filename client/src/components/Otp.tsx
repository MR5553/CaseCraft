import Input from "../components/Input";
import { type ChangeEvent, type ClipboardEvent, type HTMLAttributes, type KeyboardEvent, useEffect, useRef, useState } from "react";


interface props extends HTMLAttributes<HTMLInputElement> {
    length: number,
    onOtpChange: (value: string) => void;
}

export default function OtpBox({ length, onOtpChange }: props) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const ref = useRef([] as HTMLInputElement[]);

    useEffect(() => {
        if (ref.current[0]) {
            ref.current[0].focus();
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (!/^\d*$/.test(value)) return;

        const newVal = [...otp];
        newVal[index] = value.slice(-1);

        setOtp(newVal);

        if (value && index < length - 1) {
            for (let i = index + 1; i < length; i++) {
                if (newVal[i] === "") {
                    ref.current[i]?.focus();
                    break;
                }
            }
        }

        const otpValue = newVal.join("");
        return onOtpChange(otpValue);
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "");

        if (!pasted) return;

        const newOtp = [...otp];

        for (let i = 0; i < length && i < pasted.length; i++) {
            newOtp[i] = pasted[i];
        }

        setOtp(newOtp);

        const nextEmptyIndex = newOtp.findIndex((val, idx) => idx >= index && val === "");

        if (nextEmptyIndex !== -1) {
            ref.current[nextEmptyIndex]?.focus();
        } else {
            ref.current[length - 1]?.focus();
        }

        const otpValue = newOtp.join("");
        return onOtpChange(otpValue);
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            ref.current[index - 1]?.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            ref.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            ref.current[index + 1]?.focus();
        }
    }

    return (
        <div className="w-full flex items-center justify-between">
            {otp.map((value, index) => (
                <Input
                    type="text"
                    key={index}
                    value={value}
                    inputMode="numeric"
                    autoComplete="off"
                    onPaste={(e) => handlePaste(e, index)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                    className="size-10 text-center text-sm font-medium"
                    ref={(input) => { ref.current[index] = input! }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
                />
            ))}
        </div>
    )
}