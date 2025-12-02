import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CanvasPortraitCard from "./CanvasPortraitCard";
import {
  ChevronRight,
  Code,
  Cpu,
  Globe,
  Github,
  Linkedin,
  Mail,
  Star,
  Sun,
  Terminal,
  Zap,
  X,
} from "lucide-react";
import logo from '../assets/logo.png';

// --- DATA ---
const initialTranslations = {
  nav: {},
  hero: {},
  avatar: {},
  projects: { items: [] },
  experience: { jobs: [] },
  footer: {},
  contactModal: {},
};

// --- COMPONENTS & UTILS ---

const PixelCard = ({ children, className = "", onClick, darkMode }) => {
  const border = "border-purple-500";
  const bg = darkMode ? "bg-slate-800" : "bg-white";

  return (
    <div
      onClick={onClick}
      className={`
        relative p-6 border-4 ${border} ${bg}
        shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] 
        hover:translate-x-[2px] hover:translate-y-[2px] 
        hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
        transition-all duration-200 ${className}
      `}
    >
      {children}
      <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 -mt-2 -ml-2"></div>
      <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 -mt-2 -mr-2"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-400 -mb-2 -ml-2"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-400 -mb-2 -mr-2"></div>
    </div>
  );
};



const ContactModal = ({ isOpen, onClose, darkMode, t }) => {
  if (!isOpen) return null;

  const contactLinks = [
    {
      href: "mailto:contact@wizsebastian.com",
      icon: (
        <Mail className="text-purple-400 group-hover:scale-110 transition-transform" />
      ),
      label: t.contactModal.email,
      handle: "contact@wizsebastian.com",
    },
    {
      href: "https://linkedin.com/in/luissebastianvasquez",
      icon: (
        <Linkedin className="text-purple-400 group-hover:scale-110 transition-transform" />
      ),
      label: t.contactModal.linkedin,
      handle: "/in/luissebastianvasquez",
    },
    {
      href: "https://github.com/wizsebastian",
      icon: (
        <Github className="text-purple-400 group-hover:scale-110 transition-transform" />
      ),
      label: t.contactModal.github,
      handle: "@wizsebastian",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <PixelCard
          darkMode={darkMode}
          className="bg-slate-900 border-yellow-400"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            {t.contactModal.title}
          </h2>

          <div className="space-y-4">
            {contactLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 border-2 border-slate-600 hover:border-purple-400 hover:bg-slate-800 transition-colors cursor-pointer group"
              >
                {link.icon}
                <div>
                  <p className="font-bold text-gray-200">{link.label}</p>
                  <p className="text-xs text-gray-400">{link.handle}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-transparent border border-slate-500 text-slate-400 text-xs hover:text-white hover:border-white transition-colors"
            >
              {t.contactModal.close}
            </button>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const PixelPortfolio = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState(initialTranslations);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Failed to fetch translations:", error);
        // Fallback to English if the chosen language fails
        if (language !== "en") {
          setLanguage("en");
        }
      }
    };

    fetchTranslations();
  }, [language]);

  const t = translations; // Alias for easier access

  const handleMouseMove = (e) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };



  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  const colors = {
    bg: darkMode ? "bg-slate-900" : "bg-gray-100",
    textMain: darkMode ? "text-gray-200" : "text-slate-800",
    primary: "text-purple-400",
    accent: "text-yellow-400",
    border: "border-purple-500",
  };

  if (!t.nav.level) {
    return (
      <div
        className={`min-h-screen ${colors.bg} flex items-center justify-center text-xl ${colors.primary}`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${colors.bg} font-mono p-4 md:p-8 transition-colors duration-300 overflow-x-hidden`}
    >
      <nav className="flex justify-between items-center mb-16 border-b-4 border-slate-700 pb-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="WIZ_SEBASTIAN Logo" className="h-12 md:h-16" />
        </div>
        <div className="flex items-center gap-4 text-sm md:text-base">
          <Link
            to="/projects"
            className="flex items-center gap-2 px-3 py-1 border-2 border-slate-600 bg-slate-800 rounded-none hover:border-purple-400 transition-colors"
          >
            <span className={colors.textMain}>{t.nav.projects}</span>
          </Link>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1 border-2 border-slate-600 bg-slate-800 rounded-none hover:border-purple-400 transition-colors"
          >
            <Globe size={16} className={colors.accent} />
            <span className={colors.textMain}>{language.toUpperCase()}</span>
          </button>
          <span className={colors.accent}>{t.nav.level}</span>
          <div className="flex items-center gap-2 px-3 py-1 border-2 border-slate-600 bg-slate-800 rounded-none hover:border-purple-400 transition-colors">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative w-10 h-5 bg-slate-700 border border-slate-500 focus:outline-none"
            >
              <div
                className={`absolute top-0 w-4 h-4 bg-yellow-400 transition-transform duration-300 ${
                  darkMode ? "translate-x-0" : "translate-x-5"
                }`}
              />
            </button>
            <Sun
              size={16}
              className={`${
                !darkMode ? "text-yellow-400" : "text-gray-500"
              } transition-colors`}
            />
          </div>
        </div>
      </nav>

      <div
        className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20 relative"
        onMouseMove={handleMouseMove}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
          style={{
            background: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, 
              rgba(168, 85, 247, 0.4) 0%, 
              transparent 70%)`,
          }}
        />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 animate-pulse"
              style={{
                left: `${mousePos.x + Math.sin(i) * 60}px`,
                top: `${mousePos.y + Math.cos(i) * 60}px`,
                transition: "all 0.1s ease-out",
                opacity: mousePos.x > 0 ? 0.8 : 0,
              }}
            />
          ))}
        </div>

        <div>
          <div
            className={`inline-block px-2 py-1 mb-4 text-xs font-bold bg-purple-900 text-purple-200 border border-purple-400`}
          >
            {t.hero.class}
          </div>
          <h1
            className={`text-4xl md:text-6xl font-black mb-6 ${colors.textMain} leading-tight`}
          >
            {t.hero.title1} <br />
            <span className={colors.primary}>{t.hero.title2}</span> <br />
            {t.hero.title3}
          </h1>
          <p
            className={`text-lg mb-8 ${colors.textMain} opacity-80 border-l-4 border-yellow-400 pl-4`}
          >
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-8 py-3 bg-yellow-400 text-black font-black border-b-4 border-yellow-600 active:border-b-0 active:mt-1 hover:bg-yellow-300 transition-all uppercase tracking-widest"
            >
              {t.hero.questButton}
            </button>
            <Link
              to="/projects"
              className={`px-8 py-3 bg-transparent ${colors.primary} font-bold border-2 border-purple-500 hover:bg-purple-900/30 transition-all uppercase tracking-widest text-center`}
            >
              {t.hero.projectsButton}
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center mt-8 md:mt-0">
          <CanvasPortraitCard />
          <div className="absolute -top-4 -right-4 text-yellow-400 text-2xl animate-pulse font-bold">
            +
          </div>
          <div className="absolute top-1/2 -left-8 text-purple-400 text-xl font-bold">
            {"{}"}
          </div>
          <div className="absolute bottom-0 -right-6 text-blue-400 text-xl font-bold">
            {"</>"}
          </div>
        </div>
      </div>



      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-3xl font-bold mb-8 ${colors.primary} flex items-center gap-2`}
        >
          {t.experience.title}
          <span className="text-sm bg-purple-900 px-2 py-1 rounded-none border border-purple-500 text-white">
            {t.experience.recent}
          </span>
        </h2>

        {t.experience.jobs.map((job, index) => (
          <div
            key={index}
            className="mb-8 relative pl-8 border-l-4 border-slate-700"
          >
            <div
              className={`absolute -left-[10px] top-0 w-4 h-4 ${
                index === 0
                  ? "bg-yellow-400 border-white"
                  : "bg-slate-500 border-slate-300"
              } border-2`}
            ></div>
            <div className="bg-slate-800 p-6 border-2 border-slate-600 hover:border-purple-400 transition-colors shadow-lg">
              <div className="flex justify-between flex-wrap gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">{job.title}</h3>
                <span className="text-purple-300 font-mono text-sm">
                  {job.date}
                </span>
              </div>
              <p className="text-gray-400 mb-4 italic">{job.mission}</p>
              <ul className="space-y-2">
                {job.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    {index === 0 && i === 0 ? (
                      <Star
                        size={16}
                        className="text-yellow-400 mt-1 shrink-0"
                      />
                    ) : (
                      <ChevronRight
                        size={16}
                        className="text-purple-500 mt-1 shrink-0"
                      />
                    )}
                    <span dangerouslySetInnerHTML={{ __html: achievement }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-20 border-t-4 border-slate-700 pt-8 text-center pb-8">
        <p className="text-gray-500 font-mono text-sm mb-4">
          {t.footer.connect}
        </p>
        <div className="flex justify-center gap-6 text-2xl">
          <a
            href="https://linkedin.com/in/luissebastianvasquez"
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer hover:text-yellow-400 hover:-translate-y-1 transition-transform text-gray-400"
          >
            {t.footer.linkedin}
          </a>
          <a
            href="https://github.com/wizsebastian"
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer hover:text-yellow-400 hover:-translate-y-1 transition-transform text-gray-400"
          >
            {t.footer.github}
          </a>
          <a
            href="https://dev.to/wizsebastian"
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer hover:text-yellow-400 hover:-translate-y-1 transition-transform text-gray-400"
          >
            {t.footer.devto}
          </a>
        </div>
        <p
          className="text-xs text-gray-600 mt-8"
          dangerouslySetInnerHTML={{ __html: t.footer.copyright }}
        />
      </footer>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        darkMode={darkMode}
        t={t}
      />
    </div>
  );
};

export default PixelPortfolio;
