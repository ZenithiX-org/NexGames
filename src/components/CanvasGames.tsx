import React, { useRef, useEffect } from "react";
import { Bot, Minimize2 } from "lucide-react";
import { Game } from "../types";

interface CanvasGamesProps {
  activeGame: Game;
  gameState: "idle" | "playing" | "gameover" | "win";
  setGameState: (state: "idle" | "playing" | "gameover" | "win") => void;
  gameScore: number;
  setGameScore: (score: number) => void;
  gameHighScore: Record<string, number>;
  setGameHighScore: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  playerLives: number;
  setPlayerLives: (lives: number) => void;
  autopilotActive: boolean;
  setAutopilotActive: (active: boolean) => void;
  customSpeed: number;
  customGravity: number;
  customSpawnFreq: number;
  customShoot: boolean;
  customBoss: boolean;
  setEntityCount: (count: number) => void;
  isStageFullscreen: boolean;
  onToggleFullscreen?: () => void;
  zipBlobUrl?: string | null;
}

export default function CanvasGames({
  activeGame,
  gameState,
  setGameState,
  gameScore,
  setGameScore,
  gameHighScore,
  setGameHighScore,
  playerLives,
  setPlayerLives,
  autopilotActive,
  setAutopilotActive,
  customSpeed,
  customGravity,
  customSpawnFreq,
  customShoot,
  customBoss,
  setEntityCount,
  isStageFullscreen,
  onToggleFullscreen,
  zipBlobUrl
}: CanvasGamesProps) {
  const spaceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const runnerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  // Space Odyssey State Refs
  const spacePlayerRef = useRef({ x: 280, y: 260, width: 34, height: 20 });
  const spaceAsteroids = useRef<{ x: number; y: number; size: number; speed: number; id: number }[]>([]);
  const spaceLasers = useRef<{ x: number; y: number; speed: number }[]>([]);
  const spaceBossRef = useRef<{ x: number; y: number; hp: number; maxHp: number; direction: number; active: boolean } | null>(null);
  const spaceKeys = useRef<Record<string, boolean>>({});

  // Cyber Runner State Refs
  const runnerPlayer = useRef({ y: 240, velocityY: 0, width: 24, height: 32, isGrounded: true });
  const runnerObstacles = useRef<{ x: number; size: number; speed: number; scored: boolean }[]>([]);
  const lastSpawnTime = useRef<number>(Date.now());

  // 1. SPACE ODYSSEY LOOP
  useEffect(() => {
    if (activeGame.id !== "space-odyssey" && activeGame.id !== "sandbox-studio") return;
    if (gameState !== "playing" || !spaceCanvasRef.current) return;

    const canvas = spaceCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset initial loop configurations
    spacePlayerRef.current = { x: 280, y: 260, width: 34, height: 20 };
    spaceAsteroids.current = [];
    spaceLasers.current = [];
    spaceBossRef.current = null;
    spaceKeys.current = {};

    let localScore = 0;
    let localLives = 3;
    setGameScore(0);
    setPlayerLives(localLives);

    let lastShotTime = 0;
    let asteroidIdCounter = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      spaceKeys.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      spaceKeys.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let lastTick = Date.now();

    const loop = () => {
      const now = Date.now();
      const delta = (now - lastTick) / 1000;
      lastTick = now;

      // Primary color themes derived from game logic parameters
      const primaryColor = activeGame.parameters?.colorTheme?.primary || "#c3f400";
      const accentColor = activeGame.parameters?.colorTheme?.accent || "#ff571a";
      const bgHex = activeGame.parameters?.colorTheme?.background || "#0f0f0f";

      // Clear Canvas space
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield physics rendering effect:
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      for (let i = 0; i < 30; i++) {
        const sx = (i * 123 + now * 0.04) % canvas.width;
        const sy = (i * 87 + now * 0.08) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Read Inputs steer Player
      const speed = customSpeed;
      if (spaceKeys.current["ArrowLeft"] || spaceKeys.current["a"]) {
        spacePlayerRef.current.x = Math.max(0, spacePlayerRef.current.x - speed);
      }
      if (spaceKeys.current["ArrowRight"] || spaceKeys.current["d"]) {
        spacePlayerRef.current.x = Math.min(canvas.width - spacePlayerRef.current.width, spacePlayerRef.current.x + speed);
      }

      // Autopilot intelligence:
      if (autopilotActive) {
        let nearestAsteroid = null;
        let minDist = 9999;
        
        spaceAsteroids.current.forEach(ast => {
          const dy = spacePlayerRef.current.y - ast.y;
          if (dy > 0 && dy < minDist) {
            minDist = dy;
            nearestAsteroid = ast;
          }
        });

        if (nearestAsteroid) {
          const targetX = (nearestAsteroid as any).x + (nearestAsteroid as any).size / 2 - spacePlayerRef.current.width / 2;
          if (spacePlayerRef.current.x < targetX) {
            spacePlayerRef.current.x = Math.min(canvas.width - spacePlayerRef.current.width, spacePlayerRef.current.x + speed);
          } else if (spacePlayerRef.current.x > targetX) {
            spacePlayerRef.current.x = Math.max(0, spacePlayerRef.current.x - speed);
          }
          // auto trigger blaster weapons
          if (now - lastShotTime > 320) {
            spaceLasers.current.push({ x: spacePlayerRef.current.x + 16, y: spacePlayerRef.current.y, speed: 7 });
            lastShotTime = now;
          }
        }
      }

      // Handle blasters trigger
      if (customShoot && !autopilotActive && spaceKeys.current[" "] && now - lastShotTime > 250) {
        spaceLasers.current.push({ x: spacePlayerRef.current.x + 16, y: spacePlayerRef.current.y, speed: 8 });
        lastShotTime = now;
      }

      // Spawn falling Space Asteroids
      const spawnFrequency = customSpawnFreq;
      if (Math.random() < 0.015 * (1.8 / spawnFrequency) && spaceAsteroids.current.length < 12) {
        asteroidIdCounter++;
        spaceAsteroids.current.push({
          x: Math.random() * (canvas.width - 20),
          y: -20,
          size: 15 + Math.random() * 20,
          speed: 1.5 + Math.random() * 2,
          id: asteroidIdCounter
        });
      }

      // Sector Epic Boss Battle trigger mechanics
      if (customBoss && localScore >= 120) {
        if (!spaceBossRef.current) {
          spaceBossRef.current = { x: 230, y: 30, hp: 12, maxHp: 12, direction: 1, active: true };
        }

        const boss = spaceBossRef.current;
        if (boss.active) {
          boss.x += boss.direction * 1.5;
          if (boss.x <= 10 || boss.x >= canvas.width - 100) {
            boss.direction *= -1;
          }

          // Render Neon Boss Card frame
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(boss.x, boss.y, 80, 25);
          ctx.fillStyle = "#ff571a";
          ctx.fillRect(boss.x + 4, boss.y + 4, 72 * (boss.hp / boss.maxHp), 17);

          ctx.fillStyle = "#ffffff";
          ctx.font = "8px JetBrains Mono";
          ctx.fillText("BOSS_TERMINAL", boss.x + 12, boss.y + 15);

          // Boss weapon bullet rain
          if (Math.random() < 0.02) {
            spaceAsteroids.current.push({
              x: boss.x + 40,
              y: boss.y + 25,
              size: 10,
              speed: 4,
              id: asteroidIdCounter++
            });
          }
        }
      }

      // Render Lasers shot
      ctx.fillStyle = primaryColor;
      spaceLasers.current.forEach((las, lIdx) => {
        las.y -= las.speed;
        ctx.fillRect(las.x, las.y, 3, 10);

        // Delete laser when out of boundaries
        if (las.y < -15) {
          spaceLasers.current.splice(lIdx, 1);
        }
      });

      // Update & Render Asteroid targets
      spaceAsteroids.current.forEach((ast, aIdx) => {
        ast.y += ast.speed;

        // Render retro rock structure
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(ast.x, ast.y, ast.size, ast.size);
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(ast.x, ast.y, ast.size, ast.size);

        // Laser damage verification
        spaceLasers.current.forEach((las, lIdx) => {
          if (
            las.x > ast.x && las.x < ast.x + ast.size &&
            las.y > ast.y && las.y < ast.y + ast.size
          ) {
            // Collision hit
            spaceAsteroids.current.splice(aIdx, 1);
            spaceLasers.current.splice(lIdx, 1);
            localScore += 15;
            setGameScore(localScore);
          }
        });

        // Boss damage verification
        if (spaceBossRef.current && spaceBossRef.current.active) {
          spaceLasers.current.forEach((las, lIdx) => {
            if (
              las.x > spaceBossRef.current!.x && las.x < spaceBossRef.current!.x + 80 &&
              las.y > spaceBossRef.current!.y && las.y < spaceBossRef.current!.y + 25
            ) {
              spaceLasers.current.splice(lIdx, 1);
              spaceBossRef.current!.hp -= 1;
              if (spaceBossRef.current!.hp <= 0) {
                spaceBossRef.current!.active = false;
                localScore += 100;
                setGameScore(localScore);
                setGameState("win");
              }
            }
          });
        }

        // Bounding collision checks with Player console ship
        if (
          ast.x < spacePlayerRef.current.x + spacePlayerRef.current.width &&
          ast.x + ast.size > spacePlayerRef.current.x &&
          ast.y < spacePlayerRef.current.y + spacePlayerRef.current.height &&
          ast.y + ast.size > spacePlayerRef.current.y
        ) {
          // Player hit
          spaceAsteroids.current.splice(aIdx, 1);
          localLives -= 1;
          setPlayerLives(localLives);
          if (localLives <= 0) {
            setGameState("gameover");
            const currentHigh = gameHighScore[activeGame.id] || 0;
            if (localScore > currentHigh) {
              setGameHighScore(prev => ({ ...prev, [activeGame.id]: localScore }));
            }
          }
        }

        // Filter out bottom rock particles
        if (ast.y > canvas.height + 25) {
          spaceAsteroids.current.splice(aIdx, 1);
          localScore += 5; // survive multiplier points
          setGameScore(localScore);
        }
      });

      // Update active entities monitor
      setEntityCount(spaceAsteroids.current.length + spaceLasers.current.length + (spaceBossRef.current?.active ? 1 : 0) + 1);

      // Render Player Ship Frame
      ctx.fillStyle = primaryColor;
      ctx.fillRect(spacePlayerRef.current.x, spacePlayerRef.current.y, spacePlayerRef.current.width, spacePlayerRef.current.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(spacePlayerRef.current.x + 12, spacePlayerRef.current.y - 4, 10, 4);

      // Glowing nozzle fire effect
      ctx.fillStyle = "#ff571a";
      ctx.fillRect(spacePlayerRef.current.x + 12, spacePlayerRef.current.y + 20, 10, 4 + Math.sin(now * 0.15) * 3.5);

      // Autopilot locked lines overlay
      if (autopilotActive) {
        ctx.strokeStyle = "rgba(195, 244, 0, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(spacePlayerRef.current.x + 17, 0);
        ctx.lineTo(spacePlayerRef.current.x + 17, canvas.height);
        ctx.stroke();

        ctx.fillStyle = "#c3f400";
        ctx.font = "9px JetBrains Mono";
        ctx.fillText("AI_AUTOPILOT_SECURE_LOCKED", 12, 16);
      }

      // HUD overlay text layers
      ctx.fillStyle = "#ffffff";
      ctx.font = "11px JetBrains Mono";
      ctx.fillText(`SCORE: ${localScore}`, 12, canvas.height - 12);
      ctx.fillText(`LIVES: ${"❤️".repeat(Math.max(0, localLives))}`, canvas.width - 120, canvas.height - 12);

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, activeGame.id, autopilotActive, customSpeed, customSpawnFreq, customShoot, customBoss]);

  // 2. CYBER RUNNER LOOP
  useEffect(() => {
    if (activeGame.id !== "cyber-runner") return;
    if (gameState !== "playing" || !runnerCanvasRef.current) return;

    const canvas = runnerCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset physics blocks
    runnerPlayer.current = { y: canvas.height - 50, velocityY: 0, width: 24, height: 32, isGrounded: true };
    runnerObstacles.current = [];
    lastSpawnTime.current = Date.now();
    
    let localScore = 0;
    let localLives = 3;
    setGameScore(0);
    setPlayerLives(localLives);

    const handleJumpInput = () => {
      if (runnerPlayer.current.isGrounded) {
        runnerPlayer.current.velocityY = -8.5; // jumps rocket physics
        runnerPlayer.current.isGrounded = false;
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") {
        handleJumpInput();
      }
    };

    window.addEventListener("keydown", handleKey);
    canvas.addEventListener("mousedown", handleJumpInput);

    let lastTick = Date.now();

    const loop = () => {
      const now = Date.now();
      const delta = (now - lastTick) / 1000;
      lastTick = now;

      const primaryColor = activeGame.parameters?.colorTheme?.primary || "#c3f400";
      const accentColor = activeGame.parameters?.colorTheme?.accent || "#ff571a";
      const bgHex = activeGame.parameters?.colorTheme?.background || "#0f0f0f";

      // Clear render container with theme coloring
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Custom grid perspective lines:
      ctx.strokeStyle = "rgba(195, 244, 0, 0.15)";
      ctx.lineWidth = 1;
      const floorY = canvas.height - 40;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(canvas.width, floorY);
      ctx.stroke();

      for (let x = ((now * -0.15 * customSpeed) % 40); x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, floorY);
        ctx.lineTo(x - 30, canvas.height);
        ctx.stroke();
      }

      // Apply physics constants gravity
      const grav = customGravity;
      runnerPlayer.current.velocityY += grav;
      runnerPlayer.current.y += runnerPlayer.current.velocityY;

      // Rigid boundary bounding to platform floor
      if (runnerPlayer.current.y >= floorY - runnerPlayer.current.height) {
        runnerPlayer.current.y = floorY - runnerPlayer.current.height;
        runnerPlayer.current.velocityY = 0;
        runnerPlayer.current.isGrounded = true;
      }

      // Draw pixel character blocks (modern neo-brutalist avatar style)
      const p = runnerPlayer.current;
      ctx.fillStyle = primaryColor;
      ctx.fillRect(55, p.y, p.width, p.height);

      // Glowing visor layer
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(55 + p.width - 8, p.y + 6, 8, 4);

      // Speed scrolling particles background
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      for (let i = 0; i < 5; i++) {
        const px = ((i * 140 - now * 0.18 * customSpeed) % canvas.width + canvas.width) % canvas.width;
        ctx.fillRect(px, floorY - 50 - (i % 2) * 50, 3, 2);
      }

      // Obstacle spawner logic queue
      if (now - lastSpawnTime.current > customSpawnFreq * 1000) {
        lastSpawnTime.current = now;
        runnerObstacles.current.push({
          x: canvas.width,
          size: 15 + Math.random() * 20,
          speed: customSpeed + 1,
          scored: false
        });
      }

      setEntityCount(runnerObstacles.current.length + 1);

      // Render Obstacles lines
      runnerObstacles.current.forEach((obs, oIdx) => {
        obs.x -= obs.speed;

        ctx.fillStyle = accentColor;
        ctx.fillRect(obs.x, floorY - obs.size, obs.size, obs.size);

        // Highlight thick border card style
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(obs.x, floorY - obs.size, obs.size, obs.size);

        // Grid overlap collision check:
        const playerX = 55;
        if (
          obs.x < playerX + p.width &&
          obs.x + obs.size > playerX &&
          floorY - obs.size < p.y + p.height
        ) {
          runnerObstacles.current.splice(oIdx, 1);
          localLives -= 1;
          setPlayerLives(localLives);
          if (localLives <= 0) {
            setGameState("gameover");
            const currentHigh = gameHighScore[activeGame.id] || 0;
            if (localScore > currentHigh) {
              setGameHighScore(prev => ({ ...prev, [activeGame.id]: localScore }));
            }
          }
        }

        // Win points scoring pass
        if (obs.x < playerX - obs.size && !obs.scored) {
          obs.scored = true;
          localScore += 20;
          setGameScore(localScore);
        }
      });

      // Purge out of bound items
      runnerObstacles.current = runnerObstacles.current.filter(o => o.x > -40);

      // Rendering scoring logs overlay
      ctx.fillStyle = "#ffffff";
      ctx.font = "11px JetBrains Mono";
      ctx.fillText(`PTS: ${localScore}`, 12, 22);
      ctx.fillText(`GRAV: ${customGravity.toFixed(2)}m/s²`, 12, 42);
      ctx.fillText(`LIVES: ${"❤️".repeat(Math.max(0, localLives))}`, canvas.width - 120, 22);

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKey);
      canvas.removeEventListener("mousedown", handleJumpInput);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, activeGame.id, customSpeed, customGravity, customSpawnFreq]);

  // Handle selected view active rendering
  const isHtml = activeGame.isHtmlGame || (activeGame.id === "sandbox-studio" && !!zipBlobUrl);

  // Render using srcDoc directly if we have real, substantial HTML compiled bundle code, 
  // bypassing physical folder retrieval and ensuring 100% offline-first reliability!
  const hasRealHtmlContent = 
    activeGame.htmlContent && 
    activeGame.htmlContent.trim().length > 100 && 
    !activeGame.htmlContent.includes("<!-- ZIP CONTENT EXTRACTED -->") &&
    !activeGame.htmlContent.includes("<!-- ZIP ARCHIVE PENDING EXTRACT -->") &&
    !activeGame.htmlContent.includes("<!-- ZIP SOURCE -->") &&
    !(activeGame.physicalHtmlUrl && activeGame.physicalHtmlUrl.startsWith("/games/"));

  return (
    <div className={`relative w-full flex flex-col items-center justify-center p-1 ${isStageFullscreen ? "fixed inset-0 z-[9999] bg-[#030303] w-screen h-screen flex flex-col items-center justify-center p-0 select-none overflow-hidden" : ""}`}>
      {/* Floating Fullscreen Exit Controls HUD strictly on top of Everything when Fullscreen is Active */}
      {isStageFullscreen && (
        <div className="absolute top-4 right-4 z-[10000] flex items-center gap-3">
          <div className="hidden sm:block bg-stone-900/90 border border-zinc-805 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            🎮 Currently Playing: <span className="text-[#c3f400] font-black">{activeGame.title}</span>
          </div>
          <button
            onClick={onToggleFullscreen}
            className="bg-[#ff571a] hover:bg-red-600 text-black font-mono font-bold text-[10px] uppercase px-3.5 py-2.5 border-2 border-black flex items-center gap-1.5 transition-all shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            title="Exit Fullscreen Mode"
          >
            <Minimize2 className="w-4 h-4" />
            Exit Fullscreen (ESC)
          </button>
        </div>
      )}

      {gameState === "playing" && isHtml && (
        <div id="html-loaded-block" className={`bg-[#030303] rounded-sm overflow-hidden border border-[#c3f400] relative flex flex-col items-center transition-all ${isStageFullscreen ? "w-screen h-screen border-none" : "w-full h-[450px]"}`}>
          <iframe
            id="loaded-html-game"
            src={activeGame.id === "sandbox-studio" && zipBlobUrl ? zipBlobUrl : (activeGame.htmlUrl || undefined)}
            title={activeGame.title}
            className="w-full h-full bg-black border-none"
            sandbox="allow-scripts allow-same-origin allow-popups"
            referrerPolicy="no-referrer"
            allow="fullscreen"
            allowFullScreen={true}
          />
        </div>
      )}

      {gameState === "playing" && !isHtml && (activeGame.id === "space-odyssey" || activeGame.id === "sandbox-studio") && (
        <div className={`relative flex flex-col items-center justify-center ${isStageFullscreen ? "w-screen h-screen flex flex-col items-center justify-center" : ""}`}>
          <canvas
            ref={spaceCanvasRef}
            width={640}
            height={320}
            className={`block bg-[#0f0f0f] border rounded-none shadow-inner transition-all duration-300 ${isStageFullscreen ? "border-none w-auto max-w-full h-[78vh] aspect-[2/1] object-contain shadow-[0_0_40px_rgba(195,244,0,0.15)]" : "border-stone-800 max-w-full"}`}
          />
          <div className={`bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-zinc-400 ${isStageFullscreen ? "mt-4 text-xs px-4 py-1.5" : "absolute top-2 right-2"}`}>
            {autopilotActive ? (
              <span className="text-[#c3f400] font-black animate-pulse">🤖 AUTOPILOT SMART DRIVER RUNNING</span>
            ) : (
              <span>KEYBOARDS: A/D OR ARROWS TO STEER, SPACEBAR TO FIRE RETRO PURPLE LASERS.</span>
            )}
          </div>
        </div>
      )}

      {gameState === "playing" && !isHtml && activeGame.id === "cyber-runner" && (
        <div className={`relative flex flex-col items-center justify-center ${isStageFullscreen ? "w-screen h-screen flex flex-col items-center justify-center" : ""}`}>
          <canvas
            ref={runnerCanvasRef}
            width={640}
            height={320}
            className={`block bg-[#0f0f0f] border rounded-none shadow-inner transition-all duration-300 ${isStageFullscreen ? "border-none w-auto max-w-full h-[78vh] aspect-[2/1] object-contain shadow-[0_0_40px_rgba(255,87,26,0.15)]" : "border-stone-800 max-w-full"}`}
          />
          <div className={`bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-zinc-400 ${isStageFullscreen ? "mt-4 text-xs px-4 py-1.5" : "absolute top-2 right-2"}`}>
            <span>TOUCH/CLICK CANVAS DIRECTLY OR PRESS [UP ARROW / W] TO LEAP!</span>
          </div>
        </div>
      )}
    </div>
  );
}
