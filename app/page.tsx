"use client"

import {motion} from "framer-motion"
import {Button} from "@/components/ui/button"
import {Crown, Zap, Target, Trophy, SmileIcon} from "lucide-react"
import Link from "next/link"
import {useEffect, useState} from "react"

export default function HomePage() {
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 30},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                // ease: "easeOut",
            },
        },
    }

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                // ease: "easeInOut",
            },
        },
    }


    function useIsClient() {
        const [isClient, setIsClient] = useState(false)
        useEffect(() => {
            setIsClient(true)
        }, [])
        return isClient
    }

    const isClient = useIsClient()

    return (
        <div className="min-h-screen py-5 px-4 chessboard-pattern">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {isClient &&
                        [...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute opacity-10 dark:opacity-5"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                variants={floatingVariants}
                                animate="animate"
                                transition={{delay: i * 0.5}}
                            >
                                <Crown className="h-16 w-16 text-primary"/>
                            </motion.div >
                        ))}
                </div >

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center z-10 max-w-4xl mx-auto"
                >
                    <motion.div variants={itemVariants} className="mb-8">
                        <motion.div
                            whileHover={{scale: 1.1, rotate: 360}}
                            transition={{duration: 0.6}}
                            className="inline-block mb-6 chess-piece-shadow"
                        >
                            <Crown className="h-24 w-24 mx-auto text-slate-900 dark:text-white"/>
                        </motion.div >
                    </motion.div >

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent"
                    >
                        The Opening
                    </motion.h1 >

                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
                    >
                        Every great game begins with a strategic opening move.
                        <br />
                        Welcome to my digital chessboard of code.
                    </motion.p >

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                    >
                        <Link href="/projects">
                            <motion.div
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <Button
                                    size="lg"
                                    className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 px-8 py-4 text-lg"
                                >
                                    <Target className="mr-2 h-5 w-5"/>
                                    View My Tactics
                                </Button >
                            </motion.div >
                        </Link >
                        <Link href="/about">
                            <motion.div
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-4 text-lg border-2"
                                >
                                    <Crown className="mr-2 h-5 w-5"/>
                                    Know My Position
                                </Button >
                            </motion.div >
                        </Link >
                    </motion.div >

                    {/* Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
                    >
                        {[
                            {icon: Zap, label: "DSA Problems Solved", value: "50+"},
                            {
                                icon: SmileIcon,
                                label: "Happy Clients/Employers",
                                value: "5+"
                            },
                            {
                                icon: Trophy,
                                label: "Years Experience",
                                value: "3+"
                            },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                whileHover={{scale: 1.05, y: -5}}
                                className="text-center p-6 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700"
                            >
                                <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400"/>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div >
                                <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{stat.label}</div >
                            </motion.div >
                        ))}
                    </motion.div >
                </motion.div >

            </section >
        </div >
    )
}
