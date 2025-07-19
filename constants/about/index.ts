import {RiReactjsLine} from "react-icons/ri";
import {TbBrandNextjs} from "react-icons/tb";
import {FaAws, FaChess, FaJava, FaVuejs} from "react-icons/fa";
import {SiDocker, SiMongodb, SiPostgresql, SiRedux, SiTailwindcss, SiTypescript} from "react-icons/si";
import {LanguagesIcon} from "lucide-react";
import {GiSoccerBall} from "react-icons/gi";

export const skills = [
    {
        name: "React",
        icon: RiReactjsLine,
        color: "text-cyan-400",
        delay: 0
    },
    {
        name: "Next.js",
        icon: TbBrandNextjs,
        color: "text-white",
        delay: 0.1
    },
    {
        name: "Vue.js",
        icon: FaVuejs ,
        color: "text-green-500",
        delay: 0.2
    },
    {
        name: "TypeScript",
        icon: SiTypescript,
        color: "text-blue-500",
        delay: 0.3
    },
    {
        name: "Redux",
        icon: SiRedux ,
        color: "text-purple-600",
        delay: 0.4
    },
    {
        name: "Tailwind CSS",
        icon: SiTailwindcss ,
        color: "text-sky-400",
        delay: 0.5
    },
    {
        name: "Java",
        icon: FaJava ,
        color: "text-orange-600",
        delay: 0.6
    },
    {
        name: "PostgreSQL",
        icon: SiPostgresql,
        color: "text-blue-800",
        delay: 0.7
    },
    {
        name: "MongoDB",
        icon: SiMongodb,
        color: "text-green-600",
        delay: 0.8
    },
    {
        name: "AWS",
        icon: FaAws,
        color: "text-yellow-400",
        delay: 0.9
    },
    {
        name: "Docker",
        icon: SiDocker ,
        color: "text-blue-400",
        delay: 1.0
    },
];

export const interests = [
    {
        icon: LanguagesIcon,
        label: "Languages",
        description: "Multilingual? Not quite. Multienthusiastic? Definitely."
    },
    {
        icon: GiSoccerBall,
        label: "Football",
        description: "Ninety minutes, one ball, endless drama."
    },
    {
        icon: FaChess,
        label: "Strategy Games",
        description: "Chess, LOL, and tactical thinking."
    },
]

export const philosophy= [
    {
        title: "Strategic Thinking",
        description: "Every feature is planned with the end goal in mind",
    },
    {
        title: "Clean Code",
        description: "Readable, maintainable, and elegant solutions",
    },
    {
        title: "User First",
        description: "Technology should serve people, not the other way around",
    },
    {
        title: "Continuous Learning",
        description: "The game never ends, there's always a new move to master",
    },
]