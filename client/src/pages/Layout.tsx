import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth.store"

export function PIRVATE() {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="sign-in" state={{ from: location }} replace />
    }

    if (user && !user.verified) {
        return <Navigate to={`/verify-otp/${user._id}`} state={{ from: location }} replace />
    }

    return <Outlet />
}

export function PUBLIC() {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated && user.verified) {
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return <Outlet />
}