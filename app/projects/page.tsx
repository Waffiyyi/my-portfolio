"use client"

import {motion} from "framer-motion"
import {Target, Star} from "lucide-react"
import Icons from "@/components/icons"
import React, {useState} from "react"
import {ProjectCard} from "@/components/project-card";
import {projects} from "@/constants/projects";
import {containerVariantsGlobal, itemVariantsGlobal} from "@/constants";


const categoryConfig = {
    brilliant: {
        icon: Icons.BrilliantMove,
        label: "Brilliant Move",
        color: "text-green-600",
        bgColor: "bg-green-600/10 border-green-600/20",
        description: "Exceptional projects that showcase advanced skills"
    },
    great: {
        icon: Icons.GreatMove,
        label: "Great Move",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        description: "Solid projects with good implementation"
    },
    inaccuracy: {
        icon: Icons.InaccuracyMove,
        label: "Inaccuracy",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10 border-yellow-500/20",
        description: "Early projects with room for improvement"
    }
}

export default function ProjectsPage() {
    const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null)
    const [showPrivateInfoId, setShowPrivateInfoId] = useState<number | null>(null)

    const containerVariants = containerVariantsGlobal;
    const itemVariants= itemVariantsGlobal;

    const toggleCard = (e: React.MouseEvent, id: number) => {
        const isButtonClick = (e.target as HTMLElement).closest("button, a")
        if (isButtonClick) return
        setExpandedProjectId(expandedProjectId === id ? null : id)
    }

    return (
        <div className="min-h-screen py-20 px-4 chessboard-pattern">
            <div className="max-w-6xl mx-auto">
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
                            <Target className="h-16 w-16 text-blue-600 dark:text-blue-400 chess-piece-shadow"/>
                        </motion.div >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
                            Tactics
                        </h1 >
                        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                            Strategic moves executed with precision and purpose
                        </p >
                    </motion.div >

                    {/* Category Legend */}
                    <motion.div
                        variants={itemVariants}
                        className="grid md:grid-cols-3 gap-4 mb-12"
                    >
                        {Object.entries(categoryConfig).map(([key, config]) => (
                            <motion.div
                                key={key}
                                whileHover={{scale: 1.02, y: -2}}
                                className={`p-4 rounded-lg border-2 ${config.bgColor} backdrop-blur-sm`}
                            >
                                <div className="flex items-center mb-2">
                                    <config.icon className={`h-5 w-5 mr-2 ${config.color}`}/>
                                    <span className="font-semibold">{config.label}</span >
                                </div >
                                <p className="text-sm text-slate-600 dark:text-slate-300">{config.description}</p >
                            </motion.div >
                        ))}
                    </motion.div >

                    {/* Featured Projects */}
                    <motion.div variants={itemVariants}>
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <Star className="h-6 w-6 mr-2 text-yellow-500"/>
                            Featured Tactics
                        </h2 >
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            {projects.filter((p) => p.featured).map((project) => {
                                const config = categoryConfig[project.category as keyof typeof categoryConfig]
                                const isExpanded = expandedProjectId === project.id
                                return (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        config={config}
                                        showPrivateInfoId={showPrivateInfoId}
                                        setShowPrivateInfoId={setShowPrivateInfoId}
                                        expanded={isExpanded}
                                        onClick={toggleCard}
                                    />
                                )
                            })}
                        </div >
                    </motion.div >

                    <motion.div variants={itemVariants}>
                        <h2 className="text-2xl font-bold mb-6">All
                                                                Tactics</h2 >
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => {
                                const config = categoryConfig[project.category as keyof typeof categoryConfig]
                                const isExpanded = expandedProjectId === project.id

                                return (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        config={config}
                                        showPrivateInfoId={showPrivateInfoId}
                                        setShowPrivateInfoId={setShowPrivateInfoId}
                                        expanded={isExpanded}
                                        onClick={toggleCard}
                                        compact
                                    />
                                )
                            })}
                        </div >
                    </motion.div >
                </motion.div >
            </div >
        </div >
    )
}
