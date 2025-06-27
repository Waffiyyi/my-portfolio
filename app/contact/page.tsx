"use client"

import {motion} from "framer-motion"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Mail, MessageSquare, Send, MapPin, Phone, Clock} from "lucide-react"
import {SiGithub as Github, SiX as Twitter, SiLinkedin as Linkedin} from "react-icons/si";
import React, {useState} from "react";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";

export default function ContactPage() {
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                // ease: "easeOut",
            },
        },
    }

    const socialLinks = [
        {
            icon: Github,
            label: "GitHub",
            href: "https://github.com/waffiyyi",
            color: "hover:text-gray-900 dark:hover:text-white"
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            href: "https://linkedin.com/in/waffiyyi-fashola",
            color: "hover:text-blue-600"
        },
        {
            icon: Twitter,
            label: "Twitter",
            href: "https://x.com/_aka_echo",
            color: "hover:text-blue-400"
        },
    ]

    const contactInfo = [
        {
            icon: Mail,
            label: "Email",
            value: "fasholawafiyyi@gmail.com",
            href: "mailto:fasholawafiyyi@gmail.com"
        },
        {
            icon: MapPin,
            label: "Location",
            value: "Lagos, NG",
            href: "#"
        },
        {icon: Clock, label: "Timezone", value: "WAT (GMT+1)", href: "#"},
    ]
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState("")
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        const formData = new FormData(e.currentTarget)


        const GET_FORMS_URL = process.env.NEXT_PUBLIC_GET_FORMS_URL;
        try {
            const response = await fetch(GET_FORMS_URL as string, {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                setIsSubmitted(true)
            } else {
                setError("Failed to submit booking. Please try again.")
            }
        } catch (error) {
            setError("Network error. Please check your connection and try again.")
        } finally {
            setIsSubmitting(false)
        }
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
                            <Mail className="h-16 w-16 text-blue-600 dark:text-blue-400 chess-piece-shadow"/>
                        </motion.div >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
                            Checkmate
                        </h1 >
                        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                            Ready to make the winning move? Let's connect and
                            build something amazing together.
                        </p >
                    </motion.div >

                    {/* Availability */}
                    <motion.div
                        variants={itemVariants}
                        className={'flex justify-center'}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div >
                            <Badge variant={"secondary"}> Available</Badge >
                        </div >
                    </motion.div >
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div variants={itemVariants}>
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                                <CardHeader >
                                    <CardTitle className="flex items-center text-2xl">
                                        <MessageSquare className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400"/>
                                        Send a Message
                                    </CardTitle >
                                </CardHeader >
                                <form onSubmit={handleSubmit}>
                                    <CardContent className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="name"
                                                    className="text-sm font-medium"
                                                >
                                                    Name
                                                </label >
                                                <Input
                                                    id="name"
                                                    placeholder="Your name"
                                                    className="bg-white/50 dark:bg-slate-700/50"
                                                />
                                            </div >
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="email"
                                                    className="text-sm font-medium"
                                                >
                                                    Email
                                                </label >
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    className="bg-white/50 dark:bg-slate-700/50"
                                                />
                                            </div >
                                        </div >
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="subject"
                                                className="text-sm font-medium"
                                            >
                                                Subject
                                            </label >
                                            <Input
                                                id="subject"
                                                placeholder="What's this about?"
                                                className="bg-white/50 dark:bg-slate-700/50"
                                            />
                                        </div >
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="message"
                                                className="text-sm font-medium"
                                            >
                                                Message
                                            </label >
                                            <Textarea
                                                id="message"
                                                placeholder="Tell me about your project, ideas, or just say hello!"
                                                rows={6}
                                                className="bg-white/50 dark:bg-slate-700/50 resize-none"
                                            />
                                        </div >
                                        <motion.div
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                        >
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                size="lg"
                                                className="w-full bg-blue-600 hover:bg-blue-700"
                                            >
                                                <Send className="mr-2 h-5 w-5"/>
                                                {isSubmitting ? "Sending..." : "Send Message"}
                                            </Button >
                                        </motion.div >
                                    </CardContent >
                                </form >
                            </Card >
                        </motion.div >

                        {/* Contact Info & Social */}
                        <div className="space-y-8">
                            {/* Contact Information */}
                            <motion.div variants={itemVariants}>
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                                    <CardHeader >
                                        <CardTitle className="text-2xl">Get in
                                                                        Touch</CardTitle >
                                    </CardHeader >
                                    <CardContent className="space-y-4">
                                        {contactInfo.map((info, index) => (
                                            <motion.div
                                                key={info.label}
                                                whileHover={{x: 5}}
                                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                                            >
                                                <info.icon className="h-5 w-5 text-blue-600 dark:text-blue-400"/>
                                                <div >
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{info.label}</p >
                                                    <p className="font-medium">{info.value}</p >
                                                </div >
                                            </motion.div >
                                        ))}
                                    </CardContent >
                                </Card >
                            </motion.div >

                            {/* Social Links */}
                            <motion.div variants={itemVariants}>
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700">
                                    <CardHeader >
                                        <CardTitle className="text-2xl">Connect
                                                                        Online</CardTitle >
                                    </CardHeader >
                                    <CardContent >
                                        <div className="grid gap-4">
                                            {socialLinks.map((social, index) => (
                                                <motion.a
                                                    key={social.label}
                                                    href={social.href}
                                                    whileHover={{
                                                        scale: 1.02,
                                                        x: 5
                                                    }}
                                                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500/50 transition-all ${social.color}`}
                                                >
                                                    <social.icon className="h-6 w-6"/>
                                                    <div >
                                                        <p className="font-medium">{social.label}</p >
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">Follow
                                                                                                                  me
                                                                                                                  on {social.label}</p >
                                                    </div >
                                                </motion.a >
                                            ))}
                                        </div >
                                    </CardContent >
                                </Card >
                            </motion.div >
                        </div >
                    </div >

                    {/* Call to Action */}
                    <motion.div variants={itemVariants} className="text-center">
                        <Card className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0">
                            <CardContent className="p-12">
                                <h2 className="text-3xl font-bold mb-4">Ready to
                                                                        Start
                                                                        Your
                                                                        Next
                                                                        Project?</h2 >
                                <p className="text-xl mb-8 opacity-90">
                                    Whether you need a full-stack application, a
                                    stunning frontend, or strategic technical
                                    consulting, I'm
                                    here to help you make the right moves.
                                </p >
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <motion.div
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        <Link href={"mailto:fasholawafiyyi@gmail.com"}>
                                            <Button
                                                size="lg"
                                                variant="secondary"
                                                className="px-8"
                                            >
                                                <Mail className="mr-2 h-5 w-5"/>
                                                Start a Conversation
                                            </Button >
                                        </Link >


                                    </motion.div >
                                    <motion.div
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                    </motion.div >
                                </div >
                            </CardContent >
                        </Card >
                    </motion.div >
                </motion.div >
            </div >
        </div >
    )
}
