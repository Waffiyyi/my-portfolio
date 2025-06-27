"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { SiGithub as Github } from "react-icons/si"
import { motion } from "framer-motion"
import React from "react"
import Link from "next/link"

type Project = {
    id: number
    title: string
    description: string
    tech: string[]
    github: string
    demo: string
    type: string
    status: string
    category: string
    featured?: boolean
}

type CategoryConfig = {
    icon: React.ElementType
    label: string
    color: string
    bgColor: string
    description: string
}

interface ProjectCardProps {
    project: Project
    config: CategoryConfig
    showPrivateInfoId: number | null
    setShowPrivateInfoId: (id: number | null) => void
    expanded?: boolean
    onClick?: (e: React.MouseEvent, id: number) => void
    compact?: boolean
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
                                                            project,
                                                            config,
                                                            showPrivateInfoId,
                                                            setShowPrivateInfoId,
                                                            expanded = false,
                                                            onClick,
                                                            compact = false,
                                                        }) => {
    const isPrivate = project.github === "#"

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="group"
            onClick={(e) => onClick?.(e, project.id)}
        >
            <Card
                className={`relative h-full ${
                    compact ? "cursor-pointer" : ""
                } bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-500/50 transition-all duration-300`}
            >
                <CardHeader className={compact ? "pb-3" : ""}>
                    <div className="flex items-start justify-between mb-2">
                        <config.icon className={`h-5 w-5 ${config.color}`} />
                        <div className="flex space-x-2">
                            {isPrivate ? (
                                <div className="relative">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowPrivateInfoId(showPrivateInfoId === project.id ? null : project.id)
                                        }}
                                    >
                                        <Github className="h-3 w-3" />
                                    </Button>
                                    {showPrivateInfoId === project.id && (
                                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-slate-700 text-white rounded shadow-lg z-10">
                                            Private Repo
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                        <Github className="h-3 w-3" />
                                    </Button>
                                </Link>
                            )}
                            <Link href={project.demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <ExternalLink className="h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <CardTitle className={compact ? "text-lg" : "text-xl"}>{project.title}</CardTitle>
                </CardHeader>
                <CardContent className={compact ? "pt-0 pb-10" : ""}>
                    <p
                        className={`${
                            compact ? "text-sm" : ""
                        } text-slate-600 dark:text-slate-300 mb-2 ${expanded ? "" : "line-clamp-3"}`}
                    >
                        {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-5">
                        {(expanded || !compact ? project.tech : project.tech.slice(0, 3)).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                            </Badge>
                        ))}
                        {compact && !expanded && project.tech.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{project.tech.length - 3}</Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{project.status}</p>
                    <div className="absolute bottom-2 right-2">
                        <Badge className="text-[10px]">{project.type}</Badge>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
