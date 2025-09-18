import { useForm } from "react-hook-form";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailSchema } from "../lib/schema";
import { api } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ForgetPassword() {
    const navigate = useNavigate();

    const { handleSubmit, register, formState: { isDirty, errors, isSubmitting, isValid } } = useForm({
        mode: "all",
        resolver: yupResolver(emailSchema),
        criteriaMode: "all",
    });

    const submit = async ({ email }: { email: string }) => {
        try {
            const { data } = await api.post("/api/auth/forget-password", { email });

            if (data.success) {
                navigate(`/verify-otp/${data.id}`);

                toast.success(data.message);
            }

        } catch (error) {
            toast.error("Error while reset password")
            console.log(error)
        }
    }

    return (
        <section className="flex flex-col gap-4 items-center justify-center h-dvh">
            <div className="flex gap-6 flex-col">
                <div>
                    <h1 className="text-3xl font-semibold text-neutral-800 tracking-wider">
                        Forget password
                    </h1>
                    <p className="max-w-[40ch] text-neutral-700 font-normal mt-4">
                        Please enter your email address. We'll send you instructions to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit(submit)} className="w-full grid gap-5">

                    <div>
                        <Input
                            type="email"
                            placeholder="Enter email Address"
                            startIcon={<i className="ri-mail-line" />}
                            {...register("email")}
                        />
                        {errors.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
                    </div>

                    <Button
                        type="submit"
                        disabled={!isValid || !isDirty || isSubmitting}
                        endIcon={isSubmitting && <i className="ri-loader-2-line animate-spin" />}
                        variant="black"
                        size="default"
                    >
                        Continue
                    </Button>

                </form>
            </div>
        </section>
    )
};