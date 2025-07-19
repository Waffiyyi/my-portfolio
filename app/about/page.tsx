"use client"

import {motion} from "framer-motion"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {User, Code, Lightbulb, Rocket, Heart,} from "lucide-react"
import {Arsenal} from "@/components/arsenal";
import {interests, philosophy, skills} from "@/constants/about";
import {containerVariantsGlobal, itemVariantsGlobal} from "@/constants";



// const skills = [
//     {
//         name: "React",
//         icon: RiReactjsLine,
//         color: "text-cyan-400",
//         delay: 0
//     },
//     {
//         name: "Next.js",
//         icon: TbBrandNextjs,
//         color: "text-white",
//         delay: 0.1
//     },
//     {
//         name: "Vue.js",
//         icon: FaVuejs ,
//         color: "text-green-500",
//         delay: 0.2
//     },
//     {
//         name: "TypeScript",
//         icon: SiTypescript,
//         color: "text-blue-500",
//         delay: 0.3
//     },
//     {
//         name: "Redux",
//         icon: SiRedux ,
//         color: "text-purple-600",
//         delay: 0.4
//     },
//     {
//         name: "Tailwind CSS",
//         icon: SiTailwindcss ,
//         color: "text-sky-400",
//         delay: 0.5
//     },
//     {
//         name: "Java",
//         icon: FaJava ,
//         color: "text-orange-600",
//         delay: 0.6
//     },
//     {
//         name: "PostgreSQL",
//         icon: SiPostgresql,
//         color: "text-blue-800",
//         delay: 0.7
//     },
//     {
//         name: "MongoDB",
//         icon: SiMongodb,
//         color: "text-green-600",
//         delay: 0.8
//     },
//     {
//         name: "AWS",
//         icon: FaAws,
//         color: "text-yellow-400",
//         delay: 0.9
//     },
//     {
//         name: "Docker",
//         icon: SiDocker ,
//         color: "text-blue-400",
//         delay: 1.0
//     },
// ];

export default function AboutPage() {

    const containerVariants = containerVariantsGlobal;
    const itemVariants = itemVariantsGlobal;

    return (
        <div className="min-h-screen py-5 px-4 chessboard-pattern">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center">
                        <motion.div
                            whileHover={{scale: 1.1, rotate: 15}}
                            className="inline-block mb-6"
                        >
                            <User className="h-16 w-16 text-blue-600 dark:text-blue-400 chess-piece-shadow"/>
                        </motion.div >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
                            My Position
                        </h1 >
                        <p className="text-xl text-slate-600 dark:text-slate-300">
                            Understanding the board before making the next move
                        </p >
                    </motion.div >

                    {/* Main Content */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* About Text */}
                        <motion.div variants={itemVariants}>
                            <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                                <CardContent className="p-8">
                                    <div className="flex items-center mb-6">
                                        <Code className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400"/>
                                        <h2 className="text-2xl font-bold">The
                                                                           Developer</h2 >
                                    </div >
                                    <div className="space-y-4 text-slate-600 dark:text-slate-300">
                                        <p >
                                            Like a chess grandmaster analyzing
                                            the board, I approach every project
                                            with strategic thinking and
                                            careful planning. My journey in
                                            software development began 3 years
                                            ago, and I've been passionate
                                            about creating elegant solutions to
                                            complex problems ever since.
                                        </p >
                                        <p >
                                            I specialize in full-stack
                                            development with a focus on React,
                                            Next.js, and modern web
                                            technologies. Every line of code is
                                            a calculated move toward building
                                            exceptional user
                                            experiences.
                                        </p >
                                        <p >
                                            When I'm not coding, you'll find me
                                            studying chess openings, diving into
                                            foreign languages to decode
                                            cultures, or exploring new
                                            technologies that push the
                                            boundaries of what's possible on the
                                            web.
                                        </p >
                                    </div >
                                </CardContent >
                            </Card >
                        </motion.div >

                        {/* Philosophy */}
                        <motion.div variants={itemVariants}>
                            <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                                <CardContent className="p-8">
                                    <div className="flex items-center mb-6">
                                        <Lightbulb className="h-6 w-6 mr-3 text-yellow-500"/>
                                        <h2 className="text-2xl font-bold">Philosophy</h2 >
                                    </div >
                                    <div className="space-y-4">
                                        {philosophy.map((item) => (
                                            <motion.div
                                                key={item.title}
                                                whileHover={{x: 5}}
                                                className="border-l-4 border-blue-600 dark:border-blue-400 pl-4"
                                            >
                                                <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3 >
                                                <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p >
                                            </motion.div >
                                        ))}
                                    </div >
                                </CardContent >
                            </Card >
                        </motion.div >
                    </div >

                    {/* Skills */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                            <CardContent className="p-8">
                                <div className="flex items-center mb-6">
                                    <Rocket className="h-6 w-6 mr-3 text-green-600 dark:text-green-400"/>
                                    <h2 className="text-2xl font-bold">Arsenal</h2 >
                                </div >
                                <div className="flex flex-wrap gap-4">
                                    {skills.map((skill, index) => (
                                        <Arsenal
                                            key={index}
                                            delay={skill.delay}
                                        >
                                            <div
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
                                                >
                                                    <skill.icon className={`text-3xl ${skill.color} `}/>

                                                    {skill.name}
                                                </Badge >
                                            </div >
                                        </Arsenal >
                                    ))}
                                </div >
                            </CardContent >
                        </Card >
                    </motion.div >

                    {/* Interests */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                            <CardContent className="p-8">
                                <div className="flex items-center mb-6">
                                    <Heart className="h-6 w-6 mr-3 text-red-500"/>
                                    <h2 className="text-2xl font-bold">Beyond
                                                                       the
                                                                       Code</h2 >
                                </div >
                                <div className="grid md:grid-cols-3 gap-6">
                                    {interests.map((interest, index) => (
                                        <motion.div
                                            key={interest.label}
                                            whileHover={{scale: 1.05, y: -5}}
                                            className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                                        >
                                            <interest.icon className="h-8 w-8 mx-auto mb-3 text-blue-600 dark:text-blue-400"/>
                                            <h3 className="font-semibold mb-2">{interest.label}</h3 >
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{interest.description}</p >
                                        </motion.div >
                                    ))}
                                </div >
                            </CardContent >
                        </Card >
                    </motion.div >
                </motion.div >
            </div >
        </div >
    )
}
