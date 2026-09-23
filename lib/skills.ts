import { FiCamera, FiFilm, FiDatabase } from "react-icons/fi";
import {
  SiJavascript, SiPython, SiR, SiCplusplus, SiHtml5, SiCss, SiReact, SiNextdotjs,
  SiTailwindcss, SiNodedotjs, SiMongodb, SiDjango, SiGit, SiGithub, SiPycharm,
  SiGooglecolab, SiRstudioide, SiOverleaf, SiAutocad, SiFirebase,
} from "react-icons/si";
import {
  TbBrandCSharp, TbBrandVscode, TbBrandAdobePremiere, TbBrandAdobePhotoshop,
  TbBrandOffice, TbBrain, TbBrandVisualStudio,
} from "react-icons/tb";
import { FaJava } from "react-icons/fa";
import type { IconType } from "react-icons";

// Shared by the hero cube and the home-page skills preview.
export const SKILLS: { name: string; icon: IconType; color: string }[] = [
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Python", icon: SiPython, color: "#FFD43B" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#38BDF8" },
  { name: "Node.js", icon: SiNodedotjs, color: "#6CC24A" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "C++", icon: SiCplusplus, color: "#659AD2" },
  { name: "Java", icon: FaJava, color: "#F89820" },
  { name: "C#", icon: TbBrandCSharp, color: "#B57BE0" },
  { name: "R", icon: SiR, color: "#5B9BE6" },
  { name: "HTML5", icon: SiHtml5, color: "#F06529" },
  { name: "CSS", icon: SiCss, color: "#2F9BF0" },
  { name: "Django", icon: SiDjango, color: "#44B78B" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
  { name: "ML", icon: TbBrain, color: "#C084FC" },
  { name: "VS Code", icon: TbBrandVscode, color: "#3BA7F0" },
  { name: "PyCharm", icon: SiPycharm, color: "#21D789" },
  { name: "Colab", icon: SiGooglecolab, color: "#F9AB00" },
  { name: "RStudio", icon: SiRstudioide, color: "#75AADB" },
  { name: "Oracle DB", icon: FiDatabase, color: "#F24E4E" },
  { name: "Visual Studio", icon: TbBrandVisualStudio, color: "#A67BF0" },
  { name: "Overleaf", icon: SiOverleaf, color: "#5FB957" },
  { name: "AutoCAD", icon: SiAutocad, color: "#E8467C" },
  { name: "Premiere", icon: TbBrandAdobePremiere, color: "#9999FF" },
  { name: "Photoshop", icon: TbBrandAdobePhotoshop, color: "#31A8FF" },
  { name: "Office", icon: TbBrandOffice, color: "#F2663A" },
  { name: "Photography", icon: FiCamera, color: "#E5E5E5" },
  { name: "Filmmaking", icon: FiFilm, color: "#22D3EE" },
];
