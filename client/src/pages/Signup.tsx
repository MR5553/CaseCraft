import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.store";
import { useState } from "react";
import { signUpSchema } from "../lib/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../components/Input";
import Button from "../components/Button";
import SocialSignin from "../components/Social-Signin";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { api } from "../lib/axios";


export default function Signup() {
    const [visible, setVisible] = useState<boolean>(false);
    const { setUser } = useAuth((state) => state);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
        resolver: yupResolver(signUpSchema),
        mode: "all",
    });

    const submit = async ({ name, email, password }: { name: string, email: string, password: string }) => {
        try {
            const { data } = await api.post("api/auth/signup", { name, email, password });

            if (data.success) {
                setUser(data.user);
                toast.success(data.message);
                navigate(`/verifyemail/${data.user._id}`)
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
                        Create your account
                    </h1>
                    <p className="text-gray-500 font-normal mt-2">
                        Sign up to continue crafting, and showcasing your cases with ease.
                    </p>
                </div>


                <form onSubmit={handleSubmit(submit)} className="w-full grid gap-5">
                    <div>
                        <Input
                            type="text"
                            placeholder="Name"
                            startIcon={<i className="ri-user-line" />}
                            {...register("name")}
                        />
                        {errors.name && <span className="text-sm text-red-400">{errors.name.message}</span>}
                    </div>

                    <div>
                        <Input
                            type="email"
                            placeholder="Enter email Address"
                            startIcon={<i className="ri-mail-line" />}
                            {...register("email")}
                        />
                        {errors.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
                    </div>

                    <div>
                        <Input
                            type={visible ? "text" : "password"}
                            placeholder="Password"
                            startIcon={<i className="ri-key-2-line"></i>}
                            endIcon={<span className="cursor-pointer" onClick={() => setVisible(!visible)}>{visible ? <i className="ri-eye-line" /> : <i className="ri-eye-off-line" />}</span>}
                            {...register("password")}
                        />
                        {errors.password && <span className="text-sm text-red-400">{errors.password.message}</span>}
                    </div>

                    <Button
                        type="submit"
                        disabled={!isValid || !isDirty || isSubmitting}
                        endIcon={isSubmitting && <i className="ri-loader-2-line animate-spin" />}
                        variant="black"
                        size="default"
                    >
                        Sign up
                    </Button>

                </form>

                <SocialSignin />

                <p className="text-neutral-600 text-center">
                    Already have an account
                    <Link to="/sign-in" className="pl-2 font-medium text-blue-500 underline underline-offset-4">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    )
}