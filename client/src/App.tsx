import { lazy, Suspense, useCallback, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "./components/Loader";
import { Toaster } from "sonner";
import { PUBLIC, PIRVATE } from "./pages/Layout";
import { useAuth } from "./store/auth.store.ts";


const Signup = lazy(() => import("./pages/Signup.tsx"));
const Signin = lazy(() => import("./pages/Signin.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Home = lazy(() => import("./pages/Home.tsx"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const Configuration = lazy(() => import("./pages/Configuration.tsx"));
const Design = lazy(() => import("./pages/Design.tsx"));
const Preview = lazy(() => import("./pages/Preview.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));


const router = createBrowserRouter([
  {
    path: "/",
    // element: <PIRVATE />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/configure",
        element: <Configuration />,
        children: [
          { path: "design", element: <Design /> },
          { path: "preview", element: <Preview /> },
          { path: "check-out", element: <Checkout /> },
        ]
      },
      { path: "/profile", element: <Profile /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "/",
    element: <PUBLIC />,
    children: [
      { path: "sign-up", element: <Signup /> },
      { path: "sign-in", element: <Signin /> },
      { path: "verifyemail/:id", element: <VerifyEmail /> },
      { path: "forget-password", element: <ForgotPassword /> },
    ]
  },
  { path: "*", element: <NotFound /> },
]);


export default function App() {
  const { isAuthenticated, getProfile, hydrated } = useAuth();


  const profile = useCallback(() => { if (!isAuthenticated) getProfile(); }, [getProfile, isAuthenticated]);
  useEffect(() => { profile() }, [profile, hydrated]);


  return (
    <Suspense fallback={<Loader />}>
      <Toaster
        position="top-right"
        richColors
        duration={3000}
        closeButton={true}
      />
      <RouterProvider router={router} />
    </Suspense>
  );
}