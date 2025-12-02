import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Globe, Sun } from "lucide-react";
import logo from '../assets/logo.png';

// --- TYPE DEFINITIONS ---
interface Project {
  title: string;
  description: string;
  tags: string[];
}

interface TranslationContent {
  nav: { level: string; projects: string; };
  projects: { title: string; items: Project[]; };
}

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  darkMode: boolean;
}

// --- DATA ---
const initialTranslations: TranslationContent = {
  nav: { level: '', projects: '' },
  projects: { title: '', items: [] },
};

// --- COMPONENTS & UTILS ---

const PixelCard: React.FC<PixelCardProps> = ({ children, className = "", onClick, darkMode }) => {
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

const ProjectsPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState<TranslationContent>(initialTranslations);

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

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  const colors = {
    bg: darkMode ? "bg-slate-900" : "bg-gray-100",
    textMain: darkMode ? "text-gray-200" : "text-slate-800",
    primary: "text-purple-400",
    accent: "text-yellow-400",
    border: "border-purple-500",
    title: darkMode ? "text-white" : "text-slate-900",
    text: darkMode ? "text-gray-300" : "text-slate-700",
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
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="WIZ_SEBASTIAN Logo" className="h-12 md:h-16" />
          </Link>
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

      <div id="projects-section" className="max-w-6xl mx-auto mb-20 px-4">
        <h2
          className={`text-3xl font-bold mb-8 ${colors.primary} text-center`}
          dangerouslySetInnerHTML={{ __html: t.projects.title }}
        />

        <div className="grid md:grid-cols-3 gap-6">
          {t.projects.items.map((project: Project, i: number) => (
            <PixelCard key={i} darkMode={darkMode}>
              <div className="flex items-center gap-3 mb-4 border-b-2 border-slate-600 pb-2">
                <h3 className={`font-bold text-xl ${colors.title}`}>
                  {project.title}
                </h3>
              </div>
              <p className={`text-sm mb-4 ${colors.text}`}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, j: number) => (
                  <span
                    key={j}
                    className="text-xs bg-purple-900 text-purple-200 px-2 py-1 border border-purple-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </PixelCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;