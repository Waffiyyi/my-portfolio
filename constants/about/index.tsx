import {RiReactjsLine} from "react-icons/ri";
import {TbBrandNextjs} from "react-icons/tb";
import {FaAws, FaChess, FaJava, FaVuejs} from "react-icons/fa";
import {SiDocker, SiMongodb, SiPostgresql, SiRedux, SiTailwindcss, SiTypescript} from "react-icons/si";
import {LanguagesIcon} from "lucide-react";
import {GiSoccerBall} from "react-icons/gi";

export const skills = [
    {
        name: "React",
        icon: <RiReactjsLine className="text-cyan-400 text-3xl"/>,
        delay: 0
    },
    {
        name: "Next.js",
        icon: <TbBrandNextjs className="text-white text-3xl"/>,
        delay: 0.1
    },
    {
        name: "Vue.js",
        icon: <FaVuejs className="text-green-500 text-3xl"/>,
        delay: 0.2
    },
    {
        name: "TypeScript",
        icon: <SiTypescript className="text-blue-500 text-3xl"/>,
        delay: 0.3
    },
    {
        name: "Redux",
        icon: <SiRedux className="text-purple-600 text-3xl"/>,
        delay: 0.4
    },
    {
        name: "Tailwind CSS",
        icon: <SiTailwindcss className="text-sky-400 text-3xl"/>,
        delay: 0.5
    },
    {
        name: "Java",
        icon: <FaJava className="text-orange-600 text-3xl"/>,
        delay: 0.6
    },
    {
        name: "PostgreSQL",
        icon: <SiPostgresql className="text-blue-800 text-3xl"/>,
        delay: 0.7
    },
    {
        name: "MongoDB",
        icon: <SiMongodb className="text-green-600 text-3xl"/>,
        delay: 0.8
    },
    {
        name: "AWS",
        icon: <FaAws className="text-yellow-400 text-3xl"/>,
        delay: 0.9
    },
    {
        name: "Docker",
        icon: <SiDocker className="text-blue-400 text-3xl"/>,
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