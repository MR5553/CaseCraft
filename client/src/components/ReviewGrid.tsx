import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useAnimationFrame } from "framer-motion";

const Images = [
    "https://res.cloudinary.com/dvcp8dyvt/image/upload/v1758233137/caseCraft/phone-case_2_tq0eke.png",
    "https://res.cloudinary.com/dvcp8dyvt/image/upload/v1758233138/caseCraft/phone-case_3_m4ko90.png",
    "https://res.cloudinary.com/dvcp8dyvt/image/upload/v1758233134/caseCraft/phone-case_1_b34wxd.png",
    "https://res.cloudinary.com/dvcp8dyvt/image/upload/v1758232947/caseCraft/phone-case_e0g8wi.png",
    "https://res.cloudinary.com/dvcp8dyvt/image/upload/v1758233141/caseCraft/phone-case_5_xaobcy.png",
    "https://res.cloudinary.com/dvcp8dyvt/image/upload/v1758233140/caseCraft/phone-case_4_pq2jgo.png",
    "https://res.cloudinary.com/dvcp8dyvt/image/upload/v1758233120/caseCraft/hanuman_qfvdc2.png",
];

function splitArray<T>(array: Array<T>, split: number) {
    const result: Array<Array<T>> = []

    for (let i = 0; i < array.length; i++) {
        const index = i % split
        if (!result[index]) {
            result[index] = []
        }
        result[index].push(array[i])
    }

    return result
}

const ReviewColumn = ({ reviews, className, inView, speed = 50 }: { reviews: string[], className?: string, inView: boolean, speed: number }) => {
    const columnRef = useRef<HTMLDivElement | null>(null);
    const heightRef = useRef(0);
    const y = useMotionValue(0);


    useEffect(() => {
        if (!columnRef.current) return;

        const observer = new ResizeObserver(() => {
            if (columnRef.current) {
                heightRef.current = columnRef.current.scrollHeight / 2;
            }
        });

        observer.observe(columnRef.current);

        return () => observer.disconnect();
    }, [reviews]);


    useAnimationFrame((_t, delta) => {
        if (!inView) return;
        const next = y.get() - (speed * delta) / 1000;
        y.set(next <= -heightRef.current ? 0 : next);
    });

    const items = [...reviews, ...reviews];

    return (
        <motion.div className={className} ref={columnRef} style={{ y, willChange: "transform" }}>
            {items.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt="phone"
                    className="w-70 h-auto py-4 pointer-events-none select-none"
                />
            ))}
        </motion.div>
    )
}

export default function ReviewGrid() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(containerRef, { once: true, amount: 0.2 });
    const [column1, column2, column3] = splitArray(Images, 3);

    return (
        <section ref={containerRef}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))", gap: "2rem" }}
            className="relative h-[49rem] overflow-hidden justify-items-center"
        >

            {inView && (
                <>
                    <ReviewColumn
                        reviews={[...column1, ...column3, ...column2]}
                        speed={60}
                        inView={inView}
                    />

                    <ReviewColumn
                        reviews={[...column2, ...column1, ...column3]}
                        speed={90}
                        inView={inView}
                    />

                    <ReviewColumn
                        reviews={[...column3, ...column1, ...column2]}
                        className="max-md:hidden"
                        speed={120}
                        inView={inView}
                    />
                </>
            )}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-neutral-100" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-neutral-100" />
        </section>
    )
}