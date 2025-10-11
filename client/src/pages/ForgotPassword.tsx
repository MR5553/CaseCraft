import { useForm } from "react-hook-form";
import Button from "../components/Button";
import Input from "../components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailSchema } from "../lib/schema";
import { api } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Arrow } from "../components/Icons";
import { ButtonVariants } from "../lib/ButtonVariant";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const { handleSubmit, register, formState: { isDirty, errors, isSubmitting, isValid } } = useForm({
        mode: "all",
        resolver: yupResolver(emailSchema),
        criteriaMode: "all",
    });

    const submit = async ({ email }: { email: string }) => {
        try {
            const { data } = await api.put("/api/auth/forgot-password", { email });

            if (data.success) {
                toast.success(data.message);
                navigate(`/reset-password`);
            }

        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <div className="max-w-[25rem] mx-auto flex flex-col gap-4 items-center justify-center h-dvh">
            <div className="flex gap-6 flex-col">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800 tracking-wider">
                        Forgot password
                    </h1>
                    <p className="text-gray-500 font-normal mt-2">
                        No worries, we'll send you reset instruction to provide below email 📩
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

                    <Link to="/sign-in" className={ButtonVariants({ size: "sm" })}
                    >
                        <Arrow className="text-black size-6 rotate-180" />
                        back to sign-in
                    </Link>

                </form>
            </div>
        </div>
    )
};