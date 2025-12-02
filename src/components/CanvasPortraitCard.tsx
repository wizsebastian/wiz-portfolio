import React, { useRef, useEffect, useState } from "react";

const CanvasPortraitCard = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // URLs de las imágenes:
  // 1. 16-BIT: Usamos pixel-art con un seed 'Gamer' para un look retro colorido.
  const pixelSrc =
    "https://api.dicebear.com/9.x/fun-emoji/png?seed=Gamer&backgroundColor=transparent";
  // 2. 3D: Usamos 'fun-emoji' que tiene sombras y degradados simulando 3D.
  const threeDSrc =
    "https://api.dicebear.com/9.x/fun-emoji/png?seed=Gamer&backgroundColor=transparent";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Variables de estado para la animación
    let progress = 0; // 0 = 8bit, 1 = 3D
    let floatAngle = 0; // Para el movimiento de flotación

    // Cargar imágenes
    const pixelImg = new Image();
    const threeDImg = new Image();
    let imagesLoaded = 0;

    const onLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        // Iniciar loop cuando ambas imágenes estén listas
        render();
      }
    };

    pixelImg.src = pixelSrc;
    pixelImg.onload = onLoad;
    threeDImg.src = threeDSrc;
    threeDImg.onload = onLoad;

    // Función de interpolación lineal (Lerp) para suavizar movimientos
    const lerp = (start, end, t) => {
      return start * (1 - t) + end * t;
    };

    // Dibujar rectángulo redondeado en Canvas
    const roundRect = (ctx, x, y, w, h, r) => {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const render = () => {
      // 1. Configurar dimensiones y limpieza
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // 2. Calcular animación (Progress se acerca a 0 o 1 dependiendo del hover)
      const targetProgress = isHovered ? 1 : 0;
      progress = lerp(progress, targetProgress, 0.1); // 0.1 es la velocidad de transición

      // 3. Fondo de la Tarjeta (Dibujado en Canvas)
      // Cambia de color sutilmente: Gris oscuro a un tono morado oscuro
      const r = Math.floor(lerp(31, 45, progress));
      const g = Math.floor(lerp(41, 20, progress));
      const b = Math.floor(lerp(55, 60, progress));

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.shadowColor = isHovered
        ? "rgba(168, 85, 247, 0.6)"
        : "rgba(0,0,0,0.5)";
      ctx.shadowBlur = isHovered ? 30 : 10;
      ctx.shadowOffsetY = isHovered ? 15 : 5;

      // Dibujamos el cuerpo de la tarjeta
      roundRect(ctx, 20, 20, width - 40, height - 40, 20);
      ctx.fill();

      // Resetear sombra para las imágenes
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 4. Dibujar Decoración de Fondo (Grid Cyberpunk en modo 3D)
      ctx.save();
      ctx.globalAlpha = progress * 0.3; // Solo visible en transición a 3D
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 1;
      const gridSize = 30;
      // Efecto de grid moviéndose
      const gridOffset = (Date.now() / 50) % gridSize;

      ctx.beginPath();
      // Clip para que el grid no se salga de la tarjeta
      roundRect(ctx, 20, 20, width - 40, height - 40, 20);
      ctx.clip();

      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = gridOffset; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
      ctx.restore();

      // 5. Configurar Dibujo de Avatares
      floatAngle += 0.05;
      const floatY = Math.sin(floatAngle) * 5; // Flotación suave

      // Centro de la tarjeta
      const cx = width / 2;
      const cy = height / 2.5; // Un poco más arriba del centro

      // --- DIBUJAR AVATAR 8-BIT ---
      if (progress < 0.95) {
        ctx.save();
        ctx.globalAlpha = 1 - progress; // Se desvanece al hacer hover

        // Efecto: Pixel Art debe verse nítido
        ctx.imageSmoothingEnabled = false;

        // Escala: Se hace pequeño cuando desaparece
        const scalePixel = 1 - progress * 0.5;
        const wPixel = 180 * scalePixel;
        const hPixel = 180 * scalePixel;

        // Posición: Baja un poco cuando desaparece
        const yPixel = cy + floatY + progress * 50;

        ctx.translate(cx, yPixel);
        // Pequeña rotación "glitch" si estamos transicionando
        if (progress > 0.1) {
          ctx.rotate((Math.random() - 0.5) * 0.1);
        }
        ctx.drawImage(pixelImg, -wPixel / 2, -hPixel / 2, wPixel, hPixel);
        ctx.restore();
      }

      // --- DIBUJAR AVATAR 3D ---
      if (progress > 0.05) {
        ctx.save();
        ctx.globalAlpha = progress; // Aparece al hacer hover

        // Escala: Crece desde pequeño (pop-up)
        const scale3D = 0.5 + progress * 0.5;
        const w3D = 200 * scale3D;
        const h3D = 200 * scale3D;

        // Posición: Sube desde abajo
        const y3D = cy + floatY + (1 - progress) * 50;

        ctx.translate(cx, y3D);
        ctx.drawImage(threeDImg, -w3D / 2, -h3D / 2, w3D, h3D);

        // Brillo alrededor del 3D
        if (progress > 0.8) {
          ctx.globalCompositeOperation = "screen";
          const gradient = ctx.createRadialGradient(0, 0, 50, 0, 0, 120);
          gradient.addColorStop(0, "rgba(168, 85, 247, 0.5)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, 120, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* El Canvas maneja el fondo, la tarjeta y los avatares */}
      <canvas ref={canvasRef} width={320} height={450} className="block z-0" />

      {/* Capa de Texto HTML (Overlay) 
    Mantenemos el texto en HTML para mejor accesibilidad y nitidez,
    posicionado absolutamente sobre el canvas */}
      <div className="absolute bottom-0 left-0 w-full h-2/5 flex flex-col items-center justify-center text-center pointer-events-none p-6">
        <h2
          className={`text-2xl font-bold transition-all duration-300 ${
            isHovered ? "text-purple-300 scale-110" : "text-gray-100"
          }`}
        >
          AI BUILDER (FULL STACK) - ML Enthusiasts
        </h2>
        <div className="mt-2 flex gap-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors duration-300 
        ${
          isHovered
            ? "bg-purple-500/20 border-purple-400 text-purple-300"
            : "bg-gray-700/50 border-gray-600 text-gray-400"
        }`}
          >
            DESARROLLADOR
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors duration-300 
        ${
          isHovered
            ? "bg-blue-500/20 border-blue-400 text-blue-300"
            : "bg-gray-700/50 border-gray-600 text-gray-400"
        }`}
          >
            NVL. 42
          </span>
        </div>

        <div
          className={`mt-4 overflow-hidden transition-all duration-500 ${
            isHovered
              ? "opacity-100 max-h-20 translate-y-0"
              : "opacity-0 max-h-0 translate-y-4"
          }`}
        >
          <p className="text-xs text-gray-300">
            Transformando píxeles en experiencias inmersivas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CanvasPortraitCard;
