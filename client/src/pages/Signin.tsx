import { Link, useLocation, useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Input from "../components/Input"
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../lib/schema";
import { useAuth } from "../store/auth.store";
import SocialSignin from "../components/Social-Signin";

export default function Signin() {
    const [visible, setVisible] = useState<boolean>(false);
    const { SignIn, user } = useAuth((state) => state);
    const navigate = useNavigate();
    const location = useLocation();

    const { register, handleSubmit, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
        resolver: yupResolver(signInSchema),
        mode: "all",
    });

    const submit = async ({ email, password }: { email: string, password: string }) => {
        await SignIn(email, password);

        if (user && !user.verified) navigate(`verifyemail/${user._id}`);
        navigate("/")

        navigate(location.state?.from?.pathname, { replace: true });
    };

    return (
        <section className="flex flex-col gap-4 items-center justify-center h-dvh">
            <div className="flex gap-6 flex-col">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800 tracking-wider">
                        Sign into Case<span className="text-brand">Craft</span>
                    </h1>

                    <p className="max-w-sm text-gray-500 font-normal mt-1">
                        Sign in to continue crafting, and showcasing your cases with ease.
                    </p>
                </div>


                <form onSubmit={handleSubmit(submit)} className="w-full grid gap-5">
                    <div>
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            startIcon={<i className="ri-mail-line" />}
                            {...register("email")}
                        />
                        {errors.email &&
                            <span className="text-sm text-red-500">{errors.email.message}</span>
                        }
                    </div>

                    <div>
                        <Input
                            type={visible ? "text" : "password"}
                            placeholder="Password"
                            startIcon={<i className="ri-key-2-line"></i>}
                            endIcon={<span className="cursor-pointer" onClick={() => setVisible(!visible)}>{visible ? <i className="ri-eye-line" /> : <i className="ri-eye-off-line" />}</span>}
                            {...register("password")}
                        />
                        <div className="flex justify-between items-cente mt-1">
                            {errors.password &&
                                <span className="text-sm text-red-500">{errors.password.message}</span>
                            }
                            <Link to="/forget-password" className="text-sm text-blue-500 ml-auto">
                                Forget password
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="black"
                        size="default"
                        disabled={!isValid || !isDirty || isSubmitting}
                        endIcon={isSubmitting && <i className="ri-loader-2-line animate-spin" />}
                    >
                        Sign in
                    </Button>

                </form>

                <SocialSignin />

                <div>
                    <p className="text-neutral-700 text-base font-normal text-center">
                        didn't have an account
                        <Link to="/sign-up" className="pl-2 text-blue-500 underline underline-offset-4">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}