import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../lib/schema";
import { Link, useNavigate } from "react-router-dom";
import { Arrow } from "../components/Icons";
import { ButtonVariants } from "../lib/ButtonVariant";
import { api } from "../lib/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export default function ResetPassword() {
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [visibleConfirm, setVisibleConfirm] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
        mode: "all",
        resolver: yupResolver(resetPasswordSchema)
    });

    const submit = async ({ password }: { password: string }) => {
        try {
            const { data } = await api.post("/api/auth/reset-password", { password });

            if (data.success) {
                toast.success(data.message);
                navigate(`/sign-in`);
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
                        Set new password
                    </h1>
                    <p className="text-gray-500 font-normal mt-1">
                        Password must be 8+ characters with uppercase, lowercase, number, or special symbol.
                    </p>
                </div>

                <form onSubmit={handleSubmit(submit)} className="w-full grid gap-5">
                    <div>
                        <Input
                            type={visiblePassword ? "text" : "password"}
                            placeholder="Password"
                            startIcon={<i className="ri-key-2-line"></i>}
                            endIcon={
                                <span className="cursor-pointer" onClick={() => setVisiblePassword(!visiblePassword)}>
                                    {visiblePassword ? <i className="ri-eye-line" /> : <i className="ri-eye-off-line" />}
                                </span>
                            }
                            {...register("password")}
                        />
                        <div className="flex justify-between items-center mt-1">
                            {errors.password && (
                                <span className="text-sm text-red-500">{errors.password.message}</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <Input
                            type={visibleConfirm ? "text" : "password"}
                            placeholder="Confirm password"
                            startIcon={<i className="ri-key-2-line" />}
                            endIcon={
                                <span className="cursor-pointer"
                                    onClick={() => setVisibleConfirm(!visibleConfirm)}
                                >
                                    {visibleConfirm ? <i className="ri-eye-line" /> : <i className="ri-eye-off-line" />}
                                </span>
                            }
                            {...register("confirmPassword")}
                        />
                        <div className="flex justify-between items-cente mt-1">
                            {errors.confirmPassword &&
                                <span className="text-sm text-red-500">{errors.confirmPassword!.message}</span>
                            }
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="black"
                        size="default"
                        disabled={!isValid || !isDirty || isSubmitting}
                        endIcon={isSubmitting && <i className="ri-loader-2-line animate-spin" />}
                    >
                        Reset password
                    </Button>
                </form>

                <Link to="/sign-in" className={ButtonVariants({ size: "sm" })}
                >
                    <Arrow className="text-black size-6 rotate-180" />
                    back to sign-in
                </Link>
            </div>
        </div>
    )
}