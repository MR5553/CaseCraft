import { Outlet } from "react-router-dom";
import Steps from "../components/Steps";


export default function Configuration() {
    return (
        <section className="flex flex-col gap-y-5 mb-10">
            <Steps />
            <Outlet />
        </section>
    )
}