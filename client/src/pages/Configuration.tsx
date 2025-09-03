import { Outlet } from "react-router-dom";
import Steps from "../components/Steps";


export default function Configuration() {
    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-y-10 my-10">
            <Steps />
            <Outlet />
        </div>
    )
}