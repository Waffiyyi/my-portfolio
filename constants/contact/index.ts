import {Mail, MessageSquare, Send, MapPin, Phone, Clock} from "lucide-react"
import {SiGithub as Github, SiX as Twitter, SiLinkedin as Linkedin} from "react-icons/si";

export const socialLinks = [
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

export const contactInfo = [
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