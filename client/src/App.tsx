import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "./components/Loader";
import { Toaster } from "sonner";
import { PUBLIC } from "./pages/Layout";
import { useAuth } from "./store/auth.store.ts";


const Signup = lazy(() => import("./pages/Signup.tsx"));
const Signin = lazy(() => import("./pages/Signin.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Home = lazy(() => import("./pages/Home.tsx"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp.tsx"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword.tsx"));
const Configuration = lazy(() => import("./pages/Configuration.tsx"));
const UploadImage = lazy(() => import("./pages/UploadImage.tsx"));
const Design = lazy(() => import("./pages/Design.tsx"));
const Preview = lazy(() => import("./components/Preview.tsx"));


const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Home /> },
      {
        path: "/configure",
        element: <Configuration />,
        children: [
          { path: "upload", element: <UploadImage /> },
          { path: "design", element: <Design /> },
          { path: "preview", element: <Preview /> },
        ]
      },
    ],
  },
  {
    path: "/",
    element: <PUBLIC />,
    children: [
      { path: "sign-up", element: <Signup /> },
      { path: "sign-in", element: <Signin /> },
      { path: "verify-otp/:id", element: <VerifyOtp /> },
      { path: "forget-password", element: <ForgetPassword /> },
    ]
  },
  { path: "*", element: <NotFound /> },
]);


export default function App() {
  const { getProfile, hydrated } = useAuth();

  useEffect(() => { getProfile(); }, [getProfile, hydrated]);

  return (
    <Suspense fallback={<Loader />}>
      <Toaster
        position="top-right"
        richColors
        duration={1500}
        closeButton={true}
      />
      <RouterProvider router={router} />
    </Suspense>
  );
}