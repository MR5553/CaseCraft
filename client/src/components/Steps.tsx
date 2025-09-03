import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";


const STEPS = [
    { name: "Step 1: Add image", description: "Choose an image for your case", url: "/upload" },
    { name: "Step 2: Customize design", description: "Make the case yours", url: "/design" },
    { name: "Step 3: Summary", description: "Review your final design", url: "/preview" },
];

export default function Steps() {
    const pathname = useLocation().pathname;

    return (
        <ul className="flex flex-col md:flex-row rounded md:border-1 border-neutral-200">
            {
                STEPS.map((step, i) => {
                    const isCurrent = pathname.endsWith(step.url);
                    const isCompleted = STEPS.slice(i + 1).some((step) => pathname.endsWith(step.url));

                    return (
                        <li
                            key={step.name}
                            className={cn("relative h-20 overflow-hidden flex flex-1 items-center px-5 py-2")}
                        >
                            <Link to={`/configure${step.url}`} className="w-full">
                                <span
                                    className={cn("absolute left-0 top-0 h-full w-1 bg-neutral-300 md:bottom-0 md:top-auto md:h-1 md:w-full", { "bg-neutral-500": isCurrent, "bg-green-600": isCompleted })}
                                    aria-hidden="true"
                                />

                                <span className="flex flex-col gap-1 justify-center">
                                    <span
                                        className={cn("text-sm font-semibold text-neutral-600", { "text-neutral-600": isCurrent, "text-green-700": isCompleted })}
                                    >
                                        {step.name}
                                    </span>

                                    <span className="text-sm text-neutral-500">
                                        {step.description}
                                    </span>
                                </span>

                                {i !== 0 && (
                                    <div className="absolute inset-0 hidden w-3 md:block">
                                        <svg
                                            className="h-full w-full text-neutral-300"
                                            viewBox="0 0 12 82"
                                            fill="none"
                                            preserveAspectRatio="none">
                                            <path
                                                d="M0.5 0V31L10.5 41L0.5 51V82"
                                                stroke="currentcolor"
                                                strokeWidth={2}
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
    )
}