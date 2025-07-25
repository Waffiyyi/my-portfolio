"use client"

import {motion} from "framer-motion"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {FileText, Download, Briefcase, GraduationCap, Award, Calendar, MapPin, ExternalLink} from "lucide-react"
import Link from "next/link";
import {certifications, education, experience, skills} from "@/constants/resume";
import {containerVariantsGlobal, itemVariantsGlobal} from "@/constants";



export default function ResumePage() {
    const containerVariants = containerVariantsGlobal;
    const itemVariants= itemVariantsGlobal;

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
                            <FileText className="h-16 w-16 text-blue-600 dark:text-blue-400 chess-piece-shadow"/>
                        </motion.div >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
                            Score Sheet
                        </h1 >
                        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                            A record of strategic moves and achievements
                        </p >
                        <motion.div
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            <Link href="/waffiyyi-fashola-resume.pdf" target="_blank" rel="noopener noreferrer" download>
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                    <Download className="mr-2 h-5 w-5" />
                                    Download PDF
                                </Button>
                            </Link>
                        </motion.div >
                    </motion.div >

                    {/* Experience */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                            <CardHeader >
                                <CardTitle className="flex items-center text-2xl">
                                    <Briefcase className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400"/>
                                    Experience
                                </CardTitle >
                            </CardHeader >
                            <CardContent className="space-y-8">
                                {experience.map((job, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: index * 0.2}}
                                        className="relative pl-8 border-l-2 border-blue-600/20 last:border-l-0"
                                    >
                                        <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div >
                                        <div className="space-y-3">
                                            <div >
                                                <div className={"flex items-center gap-3"}>
                                                    <h3 className="text-xl font-semibold">{job.title}</h3 >
                                                    <Badge variant={"outline"}> {job.role}</Badge>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-slate-600 dark:text-slate-300">
                                                    <div className="flex items-center">
                                                        <Link href={job.link}>
                                                            <ExternalLink className="h-4 w-4 mr-1"/>
                                                        </Link >
                                                        {job.company}
                                                    </div >
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1"/>
                                                        {job.location}
                                                    </div >
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1"/>
                                                        {job.period}
                                                    </div >
                                                </div >
                                            </div >
                                            <p className="text-slate-600 dark:text-slate-300">{job.description}</p >
                                            <ul className="space-y-1">
                                                {job.achievements.map((achievement, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start"
                                                    >
                                                        <span className="text-blue-600 dark:text-blue-400 mr-2">•</span >
                                                        <span className="text-sm text-slate-600 dark:text-slate-300">{achievement}</span >
                                                    </li >
                                                ))}
                                            </ul >
                                        </div >
                                    </motion.div >
                                ))}
                            </CardContent >
                        </Card >
                    </motion.div >

                    {/* Education */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                            <CardHeader >
                                <CardTitle className="flex items-center text-2xl">
                                    <GraduationCap className="h-6 w-6 mr-3 text-green-600 dark:text-green-400"/>
                                    Education
                                </CardTitle >
                            </CardHeader >
                            <CardContent >
                                {education.map((edu, index) => (
                                    <div key={index} className="space-y-3">
                                        <div >
                                            <h3 className="text-xl font-semibold">{edu.degree}</h3 >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-slate-600 dark:text-slate-300">
                                                <div className="flex items-center">
                                                    <Link href={"https://www.uopeople.edu/"}>
                                                        <ExternalLink className="h-4 w-4 mr-1"/>
                                                    </Link >
                                                    {edu.school}
                                                </div >
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1"/>
                                                    {edu.location}
                                                </div >
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1"/>
                                                    {edu.period}
                                                </div >
                                            </div >
                                        </div >
                                        <div className="flex items-center space-x-4">
                                            <Badge variant="secondary">GPA: {edu.gpa}</Badge >
                                        </div >
                                        <div >
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Relevant
                                                                                                           Coursework:</p >
                                            <div className="flex flex-wrap gap-2">
                                                {edu.relevant.map((course) => (
                                                    <Badge
                                                        key={course}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {course}
                                                    </Badge >
                                                ))}
                                            </div >
                                        </div >
                                    </div >
                                ))}
                            </CardContent >
                        </Card >
                    </motion.div >

                    {/* Skills */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                            <CardHeader >
                                <CardTitle className="flex items-center text-2xl">
                                    <Award className="h-6 w-6 mr-3 text-purple-600 dark:text-purple-400"/>
                                    Skills & Technologies
                                </CardTitle >
                            </CardHeader >
                            <CardContent className="space-y-6">
                                {Object.entries(skills).map(([category, skillList]) => (
                                    <div key={category}>
                                        <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">{category}</h3 >
                                        <div className="flex flex-wrap gap-2">
                                            {skillList.map((skill, index) => (
                                                <motion.div
                                                    key={skill}
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.8
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1
                                                    }}
                                                    transition={{delay: index * 0.05}}
                                                    whileHover={{scale: 1.05}}
                                                >
                                                    <Badge
                                                        variant="secondary"
                                                        className="px-3 py-1"
                                                    >
                                                        {skill}
                                                    </Badge >
                                                </motion.div >
                                            ))}
                                        </div >
                                    </div >
                                ))}
                            </CardContent >
                        </Card >
                    </motion.div >

                    {/* Certifications */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                            <CardHeader >
                                <CardTitle className="flex items-center text-2xl">
                                    <Award className="h-6 w-6 mr-3 text-yellow-600 dark:text-yellow-400"/>
                                    Certifications
                                </CardTitle >
                            </CardHeader >
                            <CardContent >
                                <div className="grid md:grid-cols-2 gap-4">
                                    {certifications.map((cert, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{scale: 1.02, y: -2}}
                                            className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                                        >
                                            <h3 className="font-semibold mb-1">{cert.name}</h3 >
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{cert.issuer}</p >
                                            <div className="flex justify-between items-center">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {cert.date}
                                                </Badge >
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{cert.id}</span >
                                            </div >
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
