import { useLayoutEffect, useRef } from "react";
import { useInView, useAnimationFrame, motion, useMotionValue } from "framer-motion";

const PHONES = [
    "/template.png",
    "/testing.png",
    "/template.png",
    "/testing.png",
    "/testing.png",
    "/template.png",
]

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


    useLayoutEffect(() => {
        if (columnRef.current) {
            heightRef.current = columnRef.current.scrollHeight / 2;
        }
    }, [reviews]);


    useAnimationFrame((_t, delta) => {
        if (!inView) return;
        const next = y.get() - (speed * delta) / 1000;
        y.set(next <= -heightRef.current ? 0 : next);
    });

    const items = [...reviews, ...reviews];

    return (
        <div className={className}>
            <motion.div ref={columnRef} style={{ y, willChange: "transform" }} className="space-y-8 py-4">
                {items.map((src, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                        <img
                            src={src}
                            alt="phone"
                            className="w-72 h-auto pointer-events-none select-none"
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

export default function ReviewGrid() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(containerRef, { once: true, amount: 0.4 });
    const [column1, column2, column3] = splitArray(PHONES, 3);

    return (
        <section ref={containerRef}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))", gap: "2rem" }}
            className="relative h-[49rem] max-h-[100vh] overflow-hidden justify-items-center"
        >

            {inView && (
                <>
                    <ReviewColumn
                        reviews={[...column1, ...column3, ...column2]}
                        speed={60}
                        inView={inView}
                    />

                    <ReviewColumn
                        reviews={[...column2, ...column3]}
                        speed={80}
                        inView={inView}
                    />

                    <ReviewColumn
                        reviews={column3}
                        className="max-md:hidden"
                        speed={100}
                        inView={inView}
                    />
                </>
            )}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-neutral-100" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-neutral-100" />
        </section>
    )
}