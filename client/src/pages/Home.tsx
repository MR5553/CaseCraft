import { CurveArrow, Underline } from "../components/Icons";
import Navbar from "../components/Navbar";
import ReviewGrid from "../components/ReviewGrid";
import { avatars } from "../lib/Constant";


export default function Home() {
    return (
        <>
            <Navbar />

            <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-y-20 gap-x-5 mt-12 lg:mt-20">

                <div className="flex flex-col gap-8">

                    <h1 className="title font-bold tracking-tight leading-snug text-gray-900 text-wrap">
                        Your image on a <br />
                        <span className="text-brand bg-brand/30 px-2">Custom</span> Phone Case
                    </h1>

                    <p className="max-w-[60ch] text-balance">
                        Capture your favourite memories with your own, <span className="font-bold text-gray-900">one-of-one</span> {" "}
                        phone case. CaseCraft allow you to protect your memories, not just your phone.
                    </p>

                    <ul className="flex flex-col gap-3 font-medium">
                        <li className="flex gap-1.5 items-center text-left">
                            <i className="ri-check-fill text-xl shrink-0 text-brand" />
                            High-qaulity, durable material
                        </li>

                        <li className="flex gap-1.5 items-center text-left">
                            <i className="ri-check-fill text-xl shrink-0 text-brand" />
                            5 years print gaurantee
                        </li>

                        <li className="flex gap-1.5 items-center text-left">
                            <i className="ri-check-fill text-xl shrink-0 text-brand" />
                            All lastest models supported
                        </li>

                        <li className="flex gap-1.5 items-center text-left">
                            <i className="ri-check-fill text-xl shrink-0 text-brand" />
                            Wireless charging compatible
                        </li>

                        <li className="flex gap-1.5 items-center text-left">
                            <i className="ri-check-fill text-xl shrink-0 text-brand" />
                            Add text, font, emojis and lot's styles
                        </li>
                    </ul>

                    <div className="flex flex-row items-center gap-5">
                        <div className="flex -space-x-4">
                            {
                                avatars.map((avatar) => (
                                    <img
                                        className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100 object-cover"
                                        key={avatar.src}
                                        src={avatar.src}
                                        alt={avatar.alt}
                                    />
                                ))
                            }
                        </div>

                        <div className="flex flex-col justify-between">
                            <div className="flex gap-0.5">
                                <i className="ri-star-fill text-brand text-base" />
                                <i className="ri-star-fill text-brand text-base" />
                                <i className="ri-star-fill text-brand text-base" />
                                <i className="ri-star-fill text-brand text-base" />
                                <i className="ri-star-fill text-brand text-base" />
                            </div>
                            <p>
                                <span className="font-semibold">1.2K</span> happy customers
                            </p>
                        </div>
                    </div>

                </div>

                <div className="relative pointer-events-none mx-auto">
                    <img
                        src="https://res.cloudinary.com/dvcp8dyvt/image/upload/v1758232947/caseCraft/phone-case_e0g8wi.png"
                        alt="phone image"
                        className="w-70 h-auto pointer-events-none z-50 select-none"
                    />

                    <img src="/line.png" alt="line" className="absolute w-24 -left-6 -bottom-6 select-none" />
                    <img src="/your-image.png" alt="your image on case" className="absolute w-36 right-0 -top-14 select-none" />
                </div>

            </section>

            <div className="mt-16 w-full py-10 border-dashed border-y-2 border-neutral-200">
                <section className="flex flex-col gap-y-14">

                    <h2 className="title text-center font-bold tracking-tight leading-snug text-gray-900">
                        What our {""}
                        <span className="relative px-2">
                            customers {""}
                            <Underline className="pointer-events-none absolute inset-x-0 -bottom-6 text-brand text-xl" />
                        </span>
                        say
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))", placeContent: "space-between", gap: "2rem 2rem" }}>
                        <div className="flex flex-auto flex-col gap-2">
                            <div className="flex gap-0.5">
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                            </div>

                            <div className="leading-8 text-base">
                                <p>
                                    "The case feels durable and I even got a compliment on the
                                    design. Had the case for two and a half months now and {""}
                                    <span className="p-0.5 bg-brand/30 text-brand">
                                        the image is super clear
                                    </span>
                                    , on the case I had before, the image started fading into
                                    yellow-ish color after a couple weeks. Love it."
                                </p>
                            </div>

                            <div className="flex gap-4 mt-2">
                                <img
                                    className="rounded-full h-12 w-12 object-cover"
                                    src="/users/user-1.png"
                                    alt="user"
                                />
                                <div className="flex flex-col">
                                    <p className="font-semibold">Sanjay Rana</p>
                                    <div className="flex gap-1.5 items-center text-zinc-600">
                                        <i className="ri-check-fill text-xl shrink-0 text-brand" />
                                        <p className="text-sm">Verified Purchase</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-auto flex-col gap-2">
                            <div className="flex gap-0.5">
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                            </div>

                            <div className="leading-8 text-base">
                                <p>
                                    "I usually keep my phone together with my keys in my pocket
                                    and that led to some pretty heavy scratchmarks on all of my
                                    last phone cases. This one, besides a barely noticeable
                                    scratch on the corner, {""}
                                    <span className="p-0.5 bg-brand/30 text-brand">
                                        looks brand new after about half a year
                                    </span>
                                    , I dig it."
                                </p>
                            </div>

                            <div className="flex gap-4 mt-2">
                                <img
                                    className="rounded-full h-12 w-12 object-cover"
                                    src="/users/user-3.png"
                                    alt="user"
                                />
                                <div className="flex flex-col">
                                    <p className="font-semibold">Ayesha Reddy</p>
                                    <div className="flex gap-1.5 items-center text-zinc-600">
                                        <i className="ri-check-fill text-xl shrink-0 text-brand" />
                                        <p className="text-sm">Verified Purchase</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-auto flex-col gap-2">
                            <div className="flex gap-0.5">
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                                <i className="ri-star-fill text-brand text-xl" />
                            </div>

                            <div className="leading-8 text-base">
                                <p>
                                    "I usually keep my phone together with my keys in my pocket
                                    and that led to some pretty heavy scratchmarks on all of my
                                    last phone cases. This one, besides a barely noticeable
                                    scratch on the corner, {""}
                                    <span className="p-0.5 bg-brand/30 text-brand">
                                        looks brand new after about half a year
                                    </span>
                                    , I dig it."
                                </p>
                            </div>

                            <div className="flex gap-4 mt-2">
                                <img
                                    className="rounded-full h-12 w-12 object-cover"
                                    src="/users/user-3.png"
                                    alt="user"
                                />
                                <div className="flex flex-col">
                                    <p className="font-semibold">Ayesha Reddy</p>
                                    <div className="flex gap-1.5 items-center text-zinc-600">
                                        <i className="ri-check-fill text-xl shrink-0 text-brand" />
                                        <p className="text-sm">Verified Purchase</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            <ReviewGrid />

            <div className="py-10">
                <section>
                    <h1 className="max-w-3xl mx-auto title font-bold text-center tracking-tight leading-snug text-gray-900 text-wrap">
                        Upload your photo and get {" "}
                        <span className="bg-brand/20 text-brand px-2">your own case</span> now
                    </h1>

                    <div className="relative grid md:grid-cols-[auto_auto_auto] grid-cols-1 gap-6 items-center my-10"
                    >
                        <img
                            src="https://res.cloudinary.com/dvcp8dyvt/image/upload/v1758232952/caseCraft/Krishna_bdmj90.jpg"
                            alt="Krishna ji"
                            className="h-auto w-80 object-cover pointer-events-none mx-auto"
                        />

                        <CurveArrow className="size-30 stroke-brand max-md:rotate-90 mx-auto" />

                        <img
                            src="https://res.cloudinary.com/dvcp8dyvt/image/upload/v1758232947/caseCraft/phone-case_e0g8wi.png"
                            alt="phone image"
                            className="w-70 h-auto pointer-events-none mx-auto"
                        />
                    </div>
                </section>
            </div>
        </>
    )
}