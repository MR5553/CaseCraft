import { useState, type FormEvent } from "react"
import Button from "../components/Button"
import OtpBox from "../components/Otp"
import { useAuth } from "../store/auth.store"
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { api } from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { ButtonVariants } from "../lib/ButtonVariant";
import { Arrow } from "../components/Icons";

export default function VerifyEmail() {
    const { user, setUser } = useAuth();
    const [otp, setOtp] = useState<string>();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post(`api/auth/verify-email/${id}`, { otp: Number(otp) });

            if (data.success) {
                setUser(data.user);
                toast.success(data.message);
                navigate(location.state?.from?.pathname, { replace: true });
            }

        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <div className="max-w-[25rem] mx-auto flex flex-col gap-4 items-center justify-center h-dvh">
            <div className="w-[22rem] flex gap-6 flex-col">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800 tracking-wider">
                        Verify your email
                    </h1>
                    <p className="text-neutral-500 font-normal mt-2">
                        please enter the 6-digit verification code that sent to your {user.email || "email"}
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
                    // onClick={ResendVerification}

                    >
                        {"Resend it."}
                    </Button>
                </p>

                <Link to="/sign-in" className={ButtonVariants({ size: "sm" })}
                >
                    <Arrow className="text-black size-6 rotate-180" />
                    back to sign-in
                </Link>
            </div>
        </div>
    )
}