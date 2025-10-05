import { useState, type FormEvent } from "react"
import Button from "../components/Button"
import OtpBox from "../components/Otp"

export default function VerifyEmail() {
    const [otp, setOtp] = useState<string>()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        console.log(otp)
    }

    return (
        <section className="flex flex-col items-center justify-center h-dvh">
            <div className="w-[22rem] flex gap-6 flex-col">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800 tracking-wider">
                        Verify your email
                    </h1>
                    <p className="text-neutral-500 font-normal mt-2">
                        please enter the 6-digit verification code that sent to your email
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full grid gap-6">

                    <OtpBox
                        length={6}
                        onOtpChange={(otp) => setOtp(otp)}
                    />

                    <Button
                        type="submit"
                        variant="black"
                        size="default"
                        disabled={otp?.length !== 6}
                    >
                        Continue
                    </Button>
                </form>

                <p className="text-neutral-600 font-normal text-center">
                    Didn't get the code?
                    <Button
                        variant="link"
                        className="w-min ml-2"

                    >
                        {"Resend it."}
                    </Button>
                </p>
            </div>
        </section>
    )
}