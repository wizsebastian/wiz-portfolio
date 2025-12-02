import { useEffect, useRef, useState } from 'react';

const UnderConstruction = () => {
  const canvasRef = useRef(null);
  const [glitchText, setGlitchText] = useState("SYSTEM_BUILDING...");

  // Efecto de Glitch en el texto del título
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
    const originalText = "SYSTEM_BUILDING...";
    let interval: ReturnType<typeof setInterval> | undefined;

    const startGlitch = () => {
      let iteration = 0;
      clearInterval(interval);
      
      interval = setInterval(() => {
        setGlitchText(_prev => 
          originalText
            .split("")
            .map((_letter, index) => {
              if (index < iteration) {
                return originalText[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);
    };

    // Glitch aleatorio cada pocos segundos
    const loop = setInterval(startGlitch, 5000);
    return () => clearInterval(loop);
  }, []);

  // Animación del Canvas (Fondo Grid + Partículas)
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const canvas: HTMLCanvasElement = canvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let width: number, height: number;

    // Configuración de partículas
    const particles: Particle[] = [];
    const particleCount = 50;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x!: number;
      y!: number;
      size!: number;
      speedY!: number;
      color!: string;
      alpha!: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1; // Pixeles cuadrados
        this.speedY = Math.random() * -1 - 0.5; // Suben
        this.color = Math.random() > 0.5 ? '#a855f7' : '#3b82f6'; // Morado o Azul
        this.alpha = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.y += this.speedY;
        if (this.y < 0) this.reset();
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fillRect(this.x, this.y, this.size, this.size); // Dibujar cuadrados (Pixel art style)
        ctx.globalAlpha = 1;
      }
    }

    // Inicializar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Variables para la Grid
    let gridOffset = 0;
    const gridSize = 40;

    const render = () => {
      ctx.fillStyle = '#030712'; // gray-950
      ctx.fillRect(0, 0, width, height);

      // --- 1. DIBUJAR GRID RETRO (PERSPECTIVA FALSA) ---
      ctx.save();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.15;
      
      // Movimiento de la grid
      gridOffset = (gridOffset + 0.5) % gridSize;

      // Líneas Verticales
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Líneas Horizontales (Simulando movimiento)
      for (let y = gridOffset; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // --- 2. DIBUJAR PARTÍCULAS ---
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      // --- 3. Vignette (Oscurecer bordes) ---
      const gradient = ctx.createRadialGradient(width/2, height/2, height/2, width/2, height/2, height);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(1, '#030712');
      ctx.fillStyle = gradient;
      ctx.fillRect(0,0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-mono text-white">
      
      {/* Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />

      {/* Contenido Principal */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl px-4 w-full">
        
        {/* --- AVATAR CONSTRUCTOR (FLOTANDO) --- */}
        <div className="relative mb-8 animate-bounce-slow">
           {/* Halo de luz */}
           <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
           
           <img 
             src="https://api.dicebear.com/9.x/pixel-art/svg?seed=Builder&backgroundColor=transparent" 
             alt="Builder Bot" 
             className="w-32 h-32 md:w-48 md:h-48 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
             style={{ imageRendering: 'pixelated' }}
           />
           
           {/* Etiqueta flotante */}
           <div className="absolute -top-4 -right-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 transform rotate-12 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
             WIP 🚧
           </div>
        </div>

        {/* --- TITULO GLITCH --- */}
        <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg text-center">
          {glitchText}
        </h1>
        
        <p className="text-gray-400 text-sm md:text-base mb-10 text-center max-w-lg leading-relaxed">
          Nuestros pixeles están trabajando duro para compilar esta sección. 
          Vuelve pronto para ver la versión <span className="text-purple-400 font-bold">v.2.0</span>.
        </p>

        {/* --- BARRA DE PROGRESO "CARGANDO" --- */}
        <div className="w-full max-w-md bg-gray-900/80 border border-gray-700 p-1 rounded-lg shadow-2xl backdrop-blur-sm mb-12">
          <div className="h-4 w-full bg-gray-800 rounded relative overflow-hidden">
            {/* Barra animada */}
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-loading-bar w-[60%] rounded"></div>
            
            {/* Patrón de líneas sobre la barra (Estilo Construcción) */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-2 px-1 text-gray-500">
            <span>COMPILANDO ASSETS...</span>
            <span className="animate-pulse text-purple-400">78%</span>
          </div>
        </div>

        {/* --- BOTONES DE ACCIÓN --- */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group">
            <span>←</span> VOLVER AL INICIO
          </button>
        </div>

      </div>

      {/* CSS Styles para animaciones específicas */}
      <style>{`
        @keyframes loading-bar {
          0% { width: 10%; }
          50% { width: 60%; }
          70% { width: 55%; }
          100% { width: 90%; }
        }
        .animate-loading-bar {
          animation: loading-bar 4s ease-in-out infinite alternate;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
      `}</style>
    </div>
  );
};

export default UnderConstruction;