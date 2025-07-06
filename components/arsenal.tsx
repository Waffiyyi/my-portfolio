import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const iconVariants = (duration: number, delay: number): Variants => ({
    initial: { y: -10 },
    animate: {
        y: [10, -10],
        transition: {
            duration,
            repeat: Infinity,
            delay,
            ease: "linear",
            repeatType: "reverse",
        },
    },
});
export const Arsenal = ({ children, delay} : { children: React.ReactNode; delay: number }) => {
    return (
        <motion.div
            variants={iconVariants(2.5, delay)}
            initial="initial"
            animate="animate"
            className="rounded-2xl border-none p-4"
        >
            {children}
        </motion.div>
    );
};