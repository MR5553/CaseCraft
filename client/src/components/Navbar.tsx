import { Link } from "react-router-dom";
import { ButtonVariants } from "../lib/ButtonVariant";
import { Arrow } from "./Icons";
import { useAuth } from "../store/auth.store";

export default function Navbar() {
    const { isAuthenticated } = useAuth();

    return (
        <nav className="sticky bg-white/50 top-0 z-50 py-3 backdrop-blur-3xl">
            <section className="flex justify-between items-center">
                <h1 className="font-bold">
                    Case<span className="text-brand">Craft</span>
                </h1>

                <div className="flex gap-6 items-center">
                    {!isAuthenticated && (
                        <Link to="/sign-up" className={ButtonVariants({
                            variant: "link", size: "sm", className: "max-sm:hidden",
                        })}
                        >
                            Sign up
                        </Link>
                    )}

                    <Link to="" className={ButtonVariants({ size: "sm", className: "max-sm:hidden" })}>
                        Gallery
                        <i className="ri-sparkling-fill text-brand" />
                    </Link>

                    <Link to="/configure/design" className={ButtonVariants({ size: "sm", className: "bg-brand shadow" })}
                    >
                        Create now
                        <Arrow className="text-black size-6" />
                    </Link>
                </div>
            </section>
        </nav>
    );
}
