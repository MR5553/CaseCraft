import { Input } from "../components/Input";
import { type ChangeEvent, type ClipboardEvent, type HTMLAttributes, type KeyboardEvent, useEffect, useRef, useState } from "react";


interface props extends HTMLAttributes<HTMLInputElement> {
    length: number,
    onOtpChange: (value: number) => void;
}

export default function OtpBox({ length, onOtpChange }: props) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRef = useRef([] as HTMLInputElement[]);

    useEffect(() => {
        if (inputRef.current[0]) {
            inputRef.current[0].focus();
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
                    inputRef.current[i]?.focus();
                    break;
                }
            }
        }

        const otpValue = newVal.join("");
        return onOtpChange(Number(otpValue));
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
            inputRef.current[nextEmptyIndex]?.focus();
        } else {
            inputRef.current[length - 1]?.focus();
        }

        const otpValue = newOtp.join("");
        return onOtpChange(Number(otpValue));
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRef.current[index - 1]?.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRef.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRef.current[index + 1]?.focus();
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
                    ref={(input) => { inputRef.current[index] = input! }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
                />
            ))}
        </div>
    )
}