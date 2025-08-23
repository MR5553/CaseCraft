import { Link } from "react-router-dom";
import { ButtonVariants } from "../lib/ButtonVariant";
import { Github, Google } from "./Icons";

export default function SocialSignin() {
    return (
        <div>
            <div className="flex items-center gap-2">
                <hr className="w-full h-full text-neutral-200 mt-1" />
                <span className="w-full text-sm text-neutral-500 text-nowrap">Or authorize with</span>
                <hr className="w-full text-neutral-200 mt-1" />
            </div>

            <div className="flex gap-2 mt-5">
                <Link to={`${import.meta.env.VITE_SERVER_URL}/auth/google`}
                    className={ButtonVariants({ variant: "outlined", size: "default" })}>
                    <Google className="w-6 h-6" /> Google
                </Link>

                <Link to={`${import.meta.env.VITE_SERVER_URL}/auth/github`}
                    className={ButtonVariants({ variant: "outlined", size: "default" })}>
                    <Github className="w-6 h-6" /> Github
                </Link>
            </div>
        </div>
    )
}