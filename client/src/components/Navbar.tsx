import { Link } from "react-router-dom";
import { ButtonVariants } from "../lib/ButtonVariant";
import { Arrow } from "./Icons";
import { useAuth } from "../store/auth.store";


export default function Navbar() {
    const { isAuthenticated } = useAuth();

    return (
        <nav className="sticky top-0 z-[999]  bg-white/50 backdrop-blur-xl shadow py-3">
            <section className="flex justify-between items-center">

                <h1 className="font-bold">Case<span className="text-green-700">Craft</span> </h1>

                <div className="flex gap-6 items-center">
                    {
                        !isAuthenticated && <Link to="/sign-up" className={ButtonVariants({ variant: "link", size: "sm", className: "max-sm:hidden" })}>
                            Sign up
                        </Link>
                    }

                    <Link to="" className={ButtonVariants({ size: "sm", className: "max-sm:hidden" })}>
                        Gallery
                        <i className="ri-sparkling-fill text-amber-400" />
                    </Link>

                    <Link to="/configure/upload" className={ButtonVariants({ size: "sm", className: "bg-green-700 text-white shadow" })}>
                        Create now
                        <Arrow className="text-white size-6" />
                    </Link>
                </div>
            </section>
        </nav>
    )
}