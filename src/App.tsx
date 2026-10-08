import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Compass, 
  Flame, 
  Users, 
  Sparkles, 
  Sliders, 
  BookOpen, 
  CheckCircle, 
  UserPlus, 
  Search, 
  Heart, 
  Share2, 
  Zap, 
  ShieldAlert, 
  RotateCw,
  Code,
  Tv,
  Star,
  Activity,
  User,
  Bot,
  Mail,
  Lock,
  Maximize2,
  Minimize2,
  Upload,
  Folder,
  FolderOpen,
  Eye,
  FileCode,
  Layers,
  Trash2
} from "lucide-react";

import { Game, Friend, Review, ConsoleLogMsg } from "./types";
import { INITIAL_GAMES, INITIAL_FRIENDS, GAME_REVIEWS } from "./data";
import { supabase, isSupabaseConfigured } from "./supabase";
import CanvasGames from "./components/CanvasGames";
import CodeViewerModal from "./components/CodeViewerModal";
import { compileZipToSingleHtml, extractZipToVirtualFileMap, VirtualFileMap } from "./utils/zipUnpacker";
import { ShaderBackground } from "./components/ShaderBackground";
import { Navbar } from "./components/Navbar";
import { BentoHero } from "./components/BentoHero";
import { ModernGameCard } from "./components/ModernGameCard";
import { CategoryBar } from "./components/CategoryBar";

interface FileStructureNode {
  type: "file" | "directory";
  name: string;
  path: string;
  size?: number;
  children?: FileStructureNode[];
}

function FolderTreeRenderer({ node, depth = 0 }: { node: FileStructureNode; depth?: number; key?: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const isDir = node.type === "directory";

  return (
    <div className="flex flex-col select-none font-mono text-[10px]" style={{ paddingLeft: depth > 0 ? "10px" : "0px" }}>
      <div 
        onClick={() => isDir && setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 py-0.5 px-1 rounded-sm transition-colors ${isDir ? "cursor-pointer hover:bg-zinc-900/60 text-[#c3f400] font-black" : "text-stone-300 hover:text-white"}`}
      >
        {isDir ? (
          <>
            {isOpen ? <FolderOpen className="w-3.5 h-3.5 text-[#c3f400] shrink-0" /> : <Folder className="w-3.5 h-3.5 text-zinc-500 shrink-0" />}
            <span className="truncate">{node.name || "/"}</span>
          </>
        ) : (
          <>
            <FileCode className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">{node.name}</span>
            {node.size !== undefined && (
              <span className="text-[7.5px] text-zinc-500 font-normal shrink-0">
                ({node.size > 1024 ? `${(node.size / 1024).toFixed(1)} KB` : `${node.size} B`})
              </span>
            )}
          </>
        )}
      </div>
      {isDir && isOpen && node.children && (
        <div className="border-l border-zinc-800 ml-2 pl-1 flex flex-col gap-0.5">
          {node.children.map((child, idx) => (
            <FolderTreeRenderer key={child.path + idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  // Global & Navigation State matching Google Stitch "Home, About, Games" views + uploader
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);
  const [selectedGameId, setSelectedGameId] = useState<string>("space-odyssey");
  const [activeTab, setActiveTab] = useState<"home" | "games" | "about" | "play" | "studio">("home");
  const [shaderPreset, setShaderPreset] = useState<string>("cyber-aurora");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"newest" | "highest" | "most-viewed">("newest");
  
  const [isStageFullscreen, setIsStageFullscreen] = useState(false);
  const [showSupabaseGuide, setShowSupabaseGuide] = useState(false);
  
  // Custom creator states
  const [followingCreators, setFollowingCreators] = useState<string[]>(["creator-cosmic"]);
  const [likedGames, setLikedGames] = useState<string[]>(["space-odyssey"]);
  const [myTotalPlays, setMyTotalPlays] = useState<Record<string, number>>({});

  // Physics dynamic variables for sandbox canvas simulators
  const [gameScore, setGameScore] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover" | "win">("idle");
  const [playerLives, setPlayerLives] = useState(3);
  const [entityCount, setEntityCount] = useState(1);
  const [autopilotActive, setAutopilotActive] = useState(false);
  
  const [customSpeed, setCustomSpeed] = useState(6);
  const [customGravity, setCustomGravity] = useState(0.3);
  const [customSpawnFreq, setCustomSpawnFreq] = useState(1.8);
  const [customShoot, setCustomShoot] = useState(true);
  const [customBoss, setCustomBoss] = useState(true);
  const [gameHighScore, setGameHighScore] = useState<Record<string, number>>({
    "space-odyssey": 270,
    "cyber-runner": 180,
    "sandbox-studio": 0
  });

  // Fallback default game block to prevent crashes in pristine workspaces
  const defaultFallbackGame: Game = {
    id: "space-odyssey",
    title: "Space Odyssey Odyssey",
    description: "Navigate high intensity procedural space debris channels. Evade cosmic dust storms.",
    longDescription: "An immersive procedural galaxy survival game. Program custom speed coefficients, warp multipliers, and laser triggers in real-time using our sandbox suite.",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    creator: "Sector Alpha",
    creatorId: "sys-0",
    tags: ["Action", "Retro", "Experimental"],
    difficulty: "Medium",
    rating: 96,
    activePlayers: 4096,
    totalPlays: 14208,
    releaseDate: "2026-05-28",
    isHtmlGame: false,
    htmlUrl: "",
    parameters: {
      speed: 6,
      gravity: 0.15,
      obstacleFrequency: 1.8,
      shootCapabilities: true,
      maxLives: 3,
      colorTheme: {
        primary: "#c3f400",
        accent: "#ff571a",
        background: "#0f0f0f"
      }
    }
  };

  const activeGame = games.find(g => g.id === selectedGameId) || games[0] || defaultFallbackGame;

  // Sync sandbox slides dynamically when active game modifications occur
  useEffect(() => {
    if (activeGame.parameters) {
      setCustomSpeed(activeGame.parameters.speed);
      setCustomGravity(activeGame.parameters.gravity);
      setCustomSpawnFreq(activeGame.parameters.obstacleFrequency);
      setCustomShoot(activeGame.parameters.shootCapabilities);
      setCustomBoss(activeGame.parameters.bossFight || false);
    }
  }, [selectedGameId, games]);

  // Friend lists & status boards
  const [friendsList, setFriendsList] = useState<Friend[]>(INITIAL_FRIENDS);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  // Dynamic user profile settings persistence
  const [myProfile, setMyProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("nexus_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          username: parsed.username || "Guest_Gamer",
          avatar: parsed.avatar || "https://api.dicebear.com/7.x/pixel-art/svg?seed=guest",
          isSignedIn: parsed.isSignedIn ?? false,
          email: parsed.email || ""
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      username: "Guest_Gamer",
      avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=guest",
      isSignedIn: false,
      email: ""
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("nexus_profile", JSON.stringify(myProfile));
    } catch (e) {
      console.error(e);
    }
  }, [myProfile]);

  const [isDeletingGame, setIsDeletingGame] = useState<string | null>(null);

  const handleDeleteGame = async (gameId: string) => {
    try {
      // 1. If Supabase is configured, delete from Supabase table
      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase
            .from("uploaded_games")
            .delete()
            .eq("id", gameId);
          if (error) {
            console.error("[Database] Supabase deletion error log:", error);
          } else {
            console.log("[Database] Game successfully purged from Supabase cloud nodes:", gameId);
          }
        } catch (sErr) {
          console.error("[Database] Throw failed trying to delete from Supabase container:", sErr);
        }
      }

      // 2. Delete from local node server filesystem
      try {
        await fetch(`/api/html-games/${gameId}`, {
          method: "DELETE"
        });
      } catch (lErr) {
        console.error("[Database] Local API endpoint deletion error:", lErr);
      }

      // 3. Clean up selected states and refresh the games list
      if (selectedGameId === gameId) {
        setSelectedGameId("space-odyssey");
      }
      await fetchHtmlGames();
      setIsDeletingGame(null);
    } catch (err) {
      console.error("Error deleting custom sandbox game:", err);
    }
  };

  const toggleFullscreen = () => {
    const stageElement = document.getElementById("game-stage-screen");
    const targetElement = stageElement || document.documentElement;

    if (!document.fullscreenElement) {
      targetElement.requestFullscreen()
        .then(() => {
          setIsStageFullscreen(true);
        })
        .catch((err) => {
          console.warn("Fullscreen request rejected or not supported:", err);
          setIsStageFullscreen(true);
        });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => {
            setIsStageFullscreen(false);
          })
          .catch((err) => {
            console.warn("Error exiting fullscreen:", err);
            setIsStageFullscreen(false);
          });
      } else {
        setIsStageFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsStageFullscreen(isCurrentlyFullscreen);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isStageFullscreen) {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        setIsStageFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isStageFullscreen]);

  // HTML custom game uploader states
  const [htmlTitle, setHtmlTitle] = useState("");
  const [htmlDesc, setHtmlDesc] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [selectedUploadTags, setSelectedUploadTags] = useState<string[]>(["Action", "Retro"]);
  const [htmlBannerUrl, setHtmlBannerUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80");
  const [htmlBuilderLoading, setHtmlBuilderLoading] = useState(false);
  const [htmlUploadError, setHtmlUploadError] = useState("");
  const [htmlUploadSuccess, setHtmlUploadSuccess] = useState(false);
  const [uploadedGameMeta, setUploadedGameMeta] = useState<any>(null);
  const [isUploadedZip, setIsUploadedZip] = useState(false);
  const [uploadedZipBase64, setUploadedZipBase64] = useState("");
  const [virtualFileMap, setVirtualFileMap] = useState<VirtualFileMap | null>(null);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<any | null>(null);
  const [activeCodeViewerFile, setActiveCodeViewerFile] = useState<any | null>(null);
  const [zipViewMode, setZipViewMode] = useState<"explorer" | "playtest">("explorer");
  const [zipBlobUrl, setZipBlobUrl] = useState<string | null>(null);
  const [playtestKey, setPlaytestKey] = useState<number>(0);

  const [backendZipUrl, setBackendZipUrl] = useState<string | null>(null);
  const [extractedStructure, setExtractedStructure] = useState<any | null>(null);

  // States for live Game Console logger
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogMsg[]>([]);
  const [consoleFilter, setConsoleFilter] = useState<string>("");
  const [consoleLogLevel, setConsoleLogLevel] = useState<"all" | "log" | "info" | "warn" | "error">("all");
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState<boolean>(false);

  const lastCompiledHtmlRef = useRef<string>("");
  const activeBlobUrlRef = useRef<string | null>(null);

  // Set up message listener for sandboxed iframe console messages
  useEffect(() => {
    const handleConsoleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SANDBOX_CONSOLE") {
        const { method, args, timestamp } = event.data;
        const newMsg: ConsoleLogMsg = {
          id: Math.random().toString(36).substring(2, 9),
          method: method || "log",
          args: Array.isArray(args) ? args : [String(args)],
          timestamp: timestamp || new Date().toISOString()
        };
        setConsoleLogs((prev) => {
          // Keep maximum last 200 logs to ensure smooth UI performance
          const next = [...prev, newMsg];
          if (next.length > 200) {
            return next.slice(next.length - 200);
          }
          return next;
        });
      }
    };

    window.addEventListener("message", handleConsoleMessage);
    return () => {
      window.removeEventListener("message", handleConsoleMessage);
    };
  }, []);

  // Clear logs whenever playtest restarts
  useEffect(() => {
    setConsoleLogs([]);
  }, [playtestKey]);

  // Unmount-only safety cleanup for any compiled Blob URL memory allocations
  useEffect(() => {
    return () => {
      if (activeBlobUrlRef.current) {
        try {
          URL.revokeObjectURL(activeBlobUrlRef.current);
        } catch (_) {}
      }
    };
  }, []);

  const uploadZipToBackendSandbox = async (base64: string, filename: string) => {
    try {
      const upRes = await fetch("/api/sandbox/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipBase64: base64, filename })
      });
      if (upRes.ok) {
        const upData = await upRes.json();
        console.log("Uploaded sandbox ZIP successfully:", upData);
        setBackendZipUrl(upData.iframeUrl);
        setExtractedStructure(upData.structure);
      } else {
        const errData = await upRes.json();
        throw new Error(errData.error || "Failed backend sandbox extract.");
      }
    } catch (uploadErr: any) {
      console.error("Failed backend sandbox extract:", uploadErr);
      setHtmlUploadError(`Extract Server failed: ${uploadErr.message}`);
    }
  };

  useEffect(() => {
    if (isUploadedZip) {
      const hasSubstantialHtml = htmlCode && htmlCode.length > 50 && !htmlCode.includes("PENDING EXTRACT");

      let url: string | null = null;
      if (backendZipUrl) {
        // High stability physical unzipped sandbox route served natively on HTTP over any custom inlined blobs
        url = backendZipUrl;
      } else if (hasSubstantialHtml) {
        if (htmlCode === lastCompiledHtmlRef.current && activeBlobUrlRef.current) {
          // Re-use active compiled Blob URL exactly to avoid rendering jitter or redundant iframe boots
          url = activeBlobUrlRef.current;
        } else {
          // Cleanup old Blob URL before constructing updated copy
          if (activeBlobUrlRef.current) {
            try {
              URL.revokeObjectURL(activeBlobUrlRef.current);
            } catch (_) {}
          }
          
          let injectedHtml = htmlCode;
          if (injectedHtml && !injectedHtml.includes("id=\"nexus-console-interceptor\"")) {
            const interceptorScript = `
<script id="nexus-console-interceptor">
  (function() {
    if (window.__console_intercepted__) return;
    window.__console_intercepted__ = true;
    const _originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    };
    function sendToParent(method, args) {
      try {
        const processedArgs = Array.from(args).map(arg => {
          if (arg === null) return 'null';
          if (arg === undefined) return 'undefined';
          if (arg instanceof Error) {
            return { name: arg.name, message: arg.message, stack: arg.stack };
          }
          if (typeof arg === 'object') {
            try { return JSON.stringify(arg); } catch (e) { return '[Circular Object]'; }
          }
          return String(arg);
        });
        window.parent.postMessage({
          type: 'SANDBOX_CONSOLE',
          method: method,
          args: processedArgs,
          timestamp: new Date().toISOString()
        }, '*');
      } catch (err) {}
    }
    console.log = function() {
      sendToParent('log', arguments);
      _originalConsole.log.apply(console, arguments);
    };
    console.info = function() {
      sendToParent('info', arguments);
      _originalConsole.info.apply(console, arguments);
    };
    console.warn = function() {
      sendToParent('warn', arguments);
      _originalConsole.warn.apply(console, arguments);
    };
    console.error = function() {
      sendToParent('error', arguments);
      _originalConsole.error.apply(console, arguments);
    };
    window.addEventListener('error', function(event) {
      sendToParent('error', [
        'Uncaught Error: ' + event.message + ' at ' + event.filename + ':' + event.lineno + ':' + event.colno
      ]);
    });
    window.addEventListener('unhandledrejection', function(event) {
      sendToParent('error', [
        'Unhandled Promise Rejection: ' + (event.reason ? (event.reason.message || event.reason) : event.reason)
      ]);
    });
  })();
</script>
`;
            if (injectedHtml.includes("<head>")) {
              injectedHtml = injectedHtml.replace("<head>", "<head>" + interceptorScript);
            } else if (injectedHtml.includes("<html>")) {
              injectedHtml = injectedHtml.replace("<html>", "<html>" + interceptorScript);
            } else {
              injectedHtml = interceptorScript + injectedHtml;
            }
          }

          const blob = new Blob([injectedHtml], { type: "text/html" });
          const newBlobUrl = URL.createObjectURL(blob);
          lastCompiledHtmlRef.current = htmlCode;
          activeBlobUrlRef.current = newBlobUrl;
          url = newBlobUrl;
        }
      }

      if (url) {
        if (url !== zipBlobUrl) {
          setZipBlobUrl(url);
        }

        const sandboxGame: Game = {
          id: "sandbox-studio",
          title: "ZIP Studio Testbench",
          description: "Live playtest environment compiled from uploaded ZIP bundle.",
          longDescription: "Live playtest execution of your HTML5 game package. Uses compiled base64 data URLs inside a secure sandboxed viewport frame.",
          bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
          creator: myProfile?.username || "Local Developer",
          creatorId: "user-temp",
          tags: ["Local", "Live Playtest", "HTML5"],
          difficulty: "Medium",
          rating: 100,
          activePlayers: 1,
          totalPlays: 1,
          releaseDate: new Date().toISOString().substring(0, 10),
          isHtmlGame: true,
          htmlUrl: url,
          htmlContent: htmlCode,
          parameters: {
            speed: 6,
            gravity: 0.15,
            obstacleFrequency: 1.8,
            shootCapabilities: true,
            maxLives: 3,
            colorTheme: {
              primary: "#c3f400",
              accent: "#ff571a",
              background: "#0f0f0f"
            }
          }
        };

        setGames(prev => {
          const existingIdx = prev.findIndex(g => g.id === "sandbox-studio");
          if (existingIdx > -1) {
            const next = [...prev];
            next[existingIdx] = sandboxGame;
            return next;
          } else {
            return [sandboxGame, ...prev];
          }
        });

        setSelectedGameId("sandbox-studio");
        setGameState("playing");
      }
    } else {
      if (activeBlobUrlRef.current) {
        try {
          URL.revokeObjectURL(activeBlobUrlRef.current);
        } catch (_) {}
        activeBlobUrlRef.current = null;
        lastCompiledHtmlRef.current = "";
      }
      setZipBlobUrl(null);
    }
  }, [htmlCode, isUploadedZip, myProfile?.username, backendZipUrl, zipBlobUrl]);
  const [expandedFileGroups, setExpandedFileGroups] = useState<Record<string, boolean>>({
    html: true,
    css: true,
    js: true,
    other: false,
  });

  // File browser uploader handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHtmlUploadError("");
      setHtmlBuilderLoading(true);
      
      try {
        if (file.name.endsWith(".zip")) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                const b64 = (event.target.result as string).split(",")[1];
                resolve(b64);
              } else {
                reject(new Error("Failed to read dynamic ZIP archive."));
              }
            };
            reader.onerror = () => reject(new Error("An error occurred reading the ZIP archive file."));
            reader.readAsDataURL(file);
          });
          setUploadedZipBase64(base64);
          setIsUploadedZip(true);
          uploadZipToBackendSandbox(base64, file.name);
          
          try {
            const compiled = await compileZipToSingleHtml(file);
            setHtmlCode(compiled.html);
            if (!htmlTitle) {
              setHtmlTitle(compiled.title);
            }
          } catch (compileErr: any) {
            console.error("Could not compile ZIP to single HTML:", compileErr);
            setHtmlCode("<!-- ZIP ARCHIVE PENDING EXTRACT -->");
            if (!htmlTitle) {
              setHtmlTitle(file.name.replace(/\.[^/.]+$/, ""));
            }
          }

          try {
            const vMap = await extractZipToVirtualFileMap(file);
            setVirtualFileMap(vMap);
            if (vMap.entryPoint) {
              setSelectedPreviewFile(vMap.entryPoint);
            }
            setZipViewMode("explorer");
          } catch (zipErr: any) {
            console.error("Could not parse ZIP preview map:", zipErr);
          }
        } else if (file.name.endsWith(".html") || file.name.endsWith(".txt")) {
          setIsUploadedZip(false);
          setUploadedZipBase64("");
          setVirtualFileMap(null);
          setBackendZipUrl(null);
          setExtractedStructure(null);
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setHtmlCode(event.target.result as string);
              if (!htmlTitle) {
                setHtmlTitle(file.name.replace(/\.[^/.]+$/, ""));
              }
            }
          };
          reader.readAsText(file);
        } else {
          setHtmlUploadError("Only standalone raw HTML files (.html) or dynamic .zip bundles containing an index.html can be compiled securely.");
        }
      } catch (err: any) {
        setHtmlUploadError(err.message || "An error occurred compiling the zip package.");
      } finally {
        setHtmlBuilderLoading(false);
      }
    }
  };

  // Thumbnail file uploader handler converting to base64
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setHtmlBannerUrl(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setHtmlUploadError("Please select a valid image file (PNG, JPG, etc) for the game thumbnail.");
      }
    }
  };

  // Ordered list of tags
  const getAvailableUploadTags = () => {
    const defaultList = ["Action", "Arcade", "Adventure", "Experimental", "HTML5", "Platformer", "Puzzle", "Retro", "Sandbox", "Shooter", "Simulation"];
    const gameList = games.flatMap(g => g.tags || []);
    const union = Array.from(new Set([...defaultList, ...gameList])).sort();
    return union;
  };

  const toggleUploadTag = (tag: string) => {
    setSelectedUploadTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Supabase sign-in popup config variables
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authHandle, setAuthHandle] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authAvatarSeed, setAuthAvatarSeed] = useState("speedy");

  // Fetch games from backend fallback file database and/or Supabase cloud nodes
  const fetchHtmlGames = async () => {
    try {
      let combinedGames: Game[] = [
        {
          id: "space-odyssey",
          title: "Space Odyssey",
          description: "Navigate high intensity procedural space debris channels. Evade cosmic dust storms.",
          longDescription: "An immersive procedural galaxy survival game. Program custom speed coefficients, warp multipliers, and laser triggers in real-time using our sandbox suite.",
          bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
          creator: "Sector Alpha",
          creatorId: "sys-0",
          tags: ["Action", "Retro", "Experimental"],
          difficulty: "Medium",
          rating: 96,
          activePlayers: 4096,
          totalPlays: 14208,
          releaseDate: "2026-05-28",
          isHtmlGame: false,
          htmlUrl: "",
          parameters: {
            speed: 6,
            gravity: 0.15,
            obstacleFrequency: 1.8,
            shootCapabilities: true,
            maxLives: 3,
            colorTheme: {
              primary: "#c3f400",
              accent: "#ff571a",
              background: "#0f0f0f"
            }
          }
        },
        {
          id: "cyber-runner",
          title: "Cyber Runner",
          description: "Time leaps flawlessly over sweeping laser barriers in an infinite sliding neon runner.",
          longDescription: "Sprint across endless digital tracks filled with active glowing high-voltage micro-hazards. Modify gravity thresholds to fly or slide underneath.",
          bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
          creator: "Tokyo Grid",
          creatorId: "sys-1",
          tags: ["Retro", "Arcade", "Puzzle"],
          difficulty: "Hard",
          rating: 92,
          activePlayers: 1042,
          totalPlays: 11140,
          releaseDate: "2026-05-26",
          isHtmlGame: false,
          htmlUrl: "",
          parameters: {
            speed: 8,
            gravity: 0.35,
            obstacleFrequency: 1.5,
            shootCapabilities: false,
            maxLives: 3,
            colorTheme: {
              primary: "#ff571a",
              accent: "#c3f400",
              background: "#0e0e0e"
            }
          }
        }
      ];

      // Fetch from Supabase
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("uploaded_games")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (!error && data) {
          const customHtmlGamesBySupabase = data.map((g: any) => ({
            id: g.id || `supabase-html-${g.created_at || Date.now()}`,
            title: g.title,
            creator: g.creator || "Anonymous Uploader",
            creatorId: g.creator_id || "user-temp",
            tags: g.tags || ["HTML5"],
            description: g.description,
            longDescription: g.long_description || g.description,
            bannerUrl: g.banner_url || "https://images.unsplash.com/photo-1614850523011-8f49fc9ee6fd?auto=format&fit=crop&q=80&w=800",
            rating: g.rating || 100,
            activePlayers: g.active_players || 0,
            totalPlays: g.total_plays || 0,
            releaseDate: g.release_date || new Date().toISOString().substring(0, 10),
            isHtmlGame: true,
            htmlContent: g.html_content,
            htmlUrl: `/api/html-games/${g.id}/embed`,
            physicalHtmlUrl: g.html_url || g.htmlUrl
          }));
          combinedGames = [...combinedGames, ...customHtmlGamesBySupabase];
        }
      }

      // Fetch from Local Express DB fallback server
      try {
        const res = await fetch("/api/html-games");
        if (res.ok) {
          const customLocalGames = await res.json();
          // Filter duplicates which might have synchronized already
          const localOnly = customLocalGames.filter((cg: any) => !combinedGames.some(bg => bg.id === cg.id));
          combinedGames = [...combinedGames, ...localOnly];
        }
      } catch (err) {
        console.warn("Express endpoint static games offline. fallback to static client roster.", err);
      }

      setGames(combinedGames);
    } catch (e) {
      console.error("Error fetching games dataset compilation:", e);
    }
  };

  useEffect(() => {
    fetchHtmlGames();
  }, []);

  // Supabase real-time auth listeners synchronization
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const usr = session.user;
          const meta = usr.user_metadata || {};
          setMyProfile({
            username: meta.username || usr.email?.split("@")[0] || "CyberGamer",
            avatar: meta.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${meta.avatarSeed || "speedy"}`,
            isSignedIn: true,
            email: usr.email || ""
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const usr = session.user;
          const meta = usr.user_metadata || {};
          setMyProfile({
            username: meta.username || usr.email?.split("@")[0] || "CyberGamer",
            avatar: meta.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${meta.avatarSeed || "speedy"}`,
            isSignedIn: true,
            email: usr.email || ""
          });
        } else {
          setMyProfile({
            username: "Guest_Gamer",
            avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=guest",
            isSignedIn: false,
            email: ""
          });
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Creator Follow handlers
  const toggleFollow = (creatorId: string) => {
    if (followingCreators.includes(creatorId)) {
      setFollowingCreators(prev => prev.filter(c => c !== creatorId));
    } else {
      setFollowingCreators(prev => [...prev, creatorId]);
    }
  };

  const toggleLike = (gameId: string) => {
    if (likedGames.includes(gameId)) {
      setLikedGames(prev => prev.filter(g => g !== gameId));
    } else {
      setLikedGames(prev => [...prev, gameId]);
    }
  };

  // Launch any game directly inside the active playing arena
  const launchGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setGameState("idle");
    setActiveTab("play");
  };

  // Trigger game start within the Console frame
  const triggerStartGame = () => {
    setGameState("playing");
    setMyTotalPlays(prev => ({
      ...prev,
      [activeGame.id]: (prev[activeGame.id] || 0) + 1
    }));
  };

  // Dropdown options
  const allTags = Array.from(new Set(games.flatMap(g => g.tags))) as string[];

  // Filtered games logic configuration
  const filteredGames = games
    .filter(g => {
      const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = selectedTag ? g.tags.includes(selectedTag) : true;
      const matchRating = g.rating >= selectedRating;
      return matchSearch && matchTag && matchRating;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return b.releaseDate.localeCompare(a.releaseDate);
      if (sortOrder === "highest") return b.rating - a.rating;
      if (sortOrder === "most-viewed") return b.totalPlays - a.totalPlays;
      return 0;
    });

  // Supabase Authentication integration submission pipeline
  const handleSupabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      // Offline fallback profile handler
      setMyProfile({
        username: authHandle || "Guest_Gamer",
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${authAvatarSeed}`,
        isSignedIn: true,
        email: "guest@offline.local"
      });
      setShowAuthModal(false);
      setAuthLoading(false);
      return;
    }

    try {
      if (myProfile.isSignedIn) {
        // Edit live settings metadata
        const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${authAvatarSeed}`;
        const { error } = await supabase.auth.updateUser({
          data: {
            username: authHandle,
            avatar: avatarUrl,
            avatarSeed: authAvatarSeed
          }
        });
        if (error) throw error;
        setShowAuthModal(false);
      } else if (isSignUpMode) {
        // Register new handle
        const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${authAvatarSeed}`;
        const { error, data } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              username: authHandle,
              avatar: avatarUrl,
              avatarSeed: authAvatarSeed
            }
          }
        });
        if (error) throw error;
        
        if (data.session) {
          setShowAuthModal(false);
        } else {
          setAuthError("Sign up sequence launched successfully. Check your email for a validation key.");
        }
      } else {
        // Login session
        const { error, data } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword
        });
        if (error) throw error;
        if (data.session) setShowAuthModal(false);
      }
    } catch (err: any) {
      setAuthError(err.message || "An authentication vector restriction occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Standalone game code drag-drop compiles uploader
  const handleHtmlUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setHtmlUploadError("");
    setHtmlBuilderLoading(true);

    if (!htmlTitle || !htmlCode) {
      setHtmlUploadError("Titles and Raw physical HTML Content are both strictly requested.");
      setHtmlBuilderLoading(false);
      return;
    }

    try {
      const tagList = selectedUploadTags;
      let supabaseSuccess = false;
      let dbGame: any = null;

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("uploaded_games")
          .insert({
            title: htmlTitle,
            description: htmlDesc || "High fidelity developer upload compiled at the node.",
            html_content: htmlCode,
            creator: myProfile.username,
            creator_id: myProfile.isSignedIn ? (myProfile.email || "user-auth") : "user-temp",
            tags: ["HTML5", ...tagList],
            rating: 100,
            active_players: 0,
            total_plays: 0,
            release_date: new Date().toISOString().substring(0, 10),
            banner_url: htmlBannerUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
          })
          .select();

        if (error) {
          console.warn("Supabase insert fell back to express node local filesystem. Connection parameters verified.", error);
        } else if (data && data[0]) {
          supabaseSuccess = true;
          dbGame = data[0];
        }
      }

      const payload = {
        id: dbGame ? dbGame.id : undefined,
        title: htmlTitle,
        description: htmlDesc || "Static sandboxed browser container compiled dynamically.",
        htmlContent: htmlCode,
        isZip: isUploadedZip,
        zipBase64: uploadedZipBase64,
        creator: myProfile.username,
        creatorId: myProfile.isSignedIn ? (myProfile.email || "user-auth") : "user-temp",
        tags: ["HTML5", ...tagList],
        bannerUrl: htmlBannerUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
      };

      const res = await fetch("/api/html-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok || supabaseSuccess) {
        const data = res.ok ? await res.json() : null;
        setHtmlUploadSuccess(true);
        
        if (supabaseSuccess && dbGame) {
          setUploadedGameMeta({
            id: dbGame.id,
            title: dbGame.title,
            creator: dbGame.creator,
            htmlUrl: data?.game?.htmlUrl || `/api/html-games/${dbGame.id}/embed`
          });
        } else if (data) {
          setUploadedGameMeta(data.game);
        }

        await fetchHtmlGames();
      } else {
        throw new Error("Local Express upload compiler rejected code configuration.");
      }
    } catch (err: any) {
      setHtmlUploadError(err.message || "Failed posting custom code node. Check server online status.");
    } finally {
      setHtmlBuilderLoading(false);
    }
  };

  // Drag and drop HTML parser handler for file uploading
  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setHtmlUploadError("");
      setHtmlBuilderLoading(true);
      
      try {
        if (file.name.endsWith(".zip")) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                const b64 = (event.target.result as string).split(",")[1];
                resolve(b64);
              } else {
                reject(new Error("Failed to read dynamic ZIP archive."));
              }
            };
            reader.onerror = () => reject(new Error("An error occurred reading the ZIP archive file."));
            reader.readAsDataURL(file);
          });
          setUploadedZipBase64(base64);
          setIsUploadedZip(true);
          uploadZipToBackendSandbox(base64, file.name);
          
          try {
            const compiled = await compileZipToSingleHtml(file);
            setHtmlCode(compiled.html);
            if (!htmlTitle) {
              setHtmlTitle(compiled.title);
            }
          } catch (compileErr: any) {
            console.error("Could not compile ZIP to single HTML on drop:", compileErr);
            setHtmlCode("<!-- ZIP ARCHIVE PENDING EXTRACT -->");
            if (!htmlTitle) {
              setHtmlTitle(file.name.replace(/\.[^/.]+$/, ""));
            }
          }

          try {
            const vMap = await extractZipToVirtualFileMap(file);
            setVirtualFileMap(vMap);
            if (vMap.entryPoint) {
              setSelectedPreviewFile(vMap.entryPoint);
            }
            setZipViewMode("explorer");
          } catch (zipErr: any) {
            console.error("Could not parse ZIP preview map on drop:", zipErr);
          }
        } else if (file.name.endsWith(".html") || file.name.endsWith(".txt")) {
          setIsUploadedZip(false);
          setUploadedZipBase64("");
          setVirtualFileMap(null);
          setBackendZipUrl(null);
          setExtractedStructure(null);
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setHtmlCode(event.target.result as string);
              if (!htmlTitle) {
                setHtmlTitle(file.name.replace(/\.[^/.]+$/, ""));
              }
            }
          };
          reader.readAsText(file);
        } else {
          setHtmlUploadError("Only standalone raw HTML files (.html) or dynamic .zip bundles containing an index.html can be compiled securely.");
        }
      } catch (err: any) {
        setHtmlUploadError(err.message || "An error occurred compiling the zip package.");
      } finally {
        setHtmlBuilderLoading(false);
      }
    }
  };

  return (
    <div id="nexus-container" className="min-h-screen relative flex flex-col custom-scrollbar overflow-y-auto bg-zinc-950/80 text-zinc-100 font-sans selection:bg-emerald-400 selection:text-black">
      
      {/* 3D Moving Shader Gradient Background */}
      <ShaderBackground presetId={shaderPreset} />

      {/* 21st.dev Style Floating Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        myProfile={myProfile}
        onSignInClick={() => {
          setAuthHandle("");
          setAuthAvatarSeed("speedy");
          setShowAuthModal(true);
        }}
        onProfileClick={() => {
          setAuthHandle(myProfile.username);
          setShowAuthModal(true);
        }}
        onSignOutClick={async () => {
          if (isSupabaseConfigured && supabase) {
            await supabase.auth.signOut();
          }
          setMyProfile({
            username: "Guest_Gamer",
            avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=guest",
            isSignedIn: false,
            email: ""
          });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        shaderPreset={shaderPreset}
        setShaderPreset={setShaderPreset}
        gamesCount={games.length}
      />

      {/* -------------------------------------------------------------
          BODY DISPLAY CONTAINER LAYOUTS
         ------------------------------------------------------------- */}
      <main id="nexus-main-area" className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8 relative z-10">

        {/* -------------------------------------------------------------
            SECTION: HOME VIEW (21st.dev Bento & Featured)
           ------------------------------------------------------------- */}
        {activeTab === "home" && (
          <div className="flex flex-col gap-8 animate-fadeIn">
            
            {/* 21st.dev Bento Hero Showcase */}
            {games.length > 0 && (
              <BentoHero
                featuredGame={games[0]}
                onPlay={(id) => launchGame(id)}
                onOpenStudio={() => setActiveTab("studio")}
              />
            )}

            {/* Bento Grid: Community & Engine Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Bento Card 1: YouTube Community Showcase */}
              <div className="md:col-span-7 relative overflow-hidden rounded-3xl p-6 md:p-8 bg-zinc-950/60 backdrop-blur-xl border border-white/[0.08] hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between group">
                <div className="absolute -top-16 -right-16 w-52 h-52 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                      Community Spotlight
                    </span>
                    <span className="text-zinc-400 text-xs font-mono">@playingring</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white group-hover:text-orange-400 transition-colors">
                    Official Dev Channel
                  </h3>
                  <p className="text-zinc-300 text-xs md:text-sm leading-relaxed max-w-md">
                    Watch game development breakdowns, developer vlogs, and community highlight reels on our YouTube channel.
                  </p>
                </div>

                <div className="pt-6 relative z-10 flex items-center justify-between">
                  <button 
                    onClick={() => window.open("https://youtube.com/@playingring?si=u1z8zxAqfCEyj6i6", "_blank")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold text-xs shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-all active:scale-95"
                  >
                    <span>Subscribe to Channel</span>
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-zinc-400">Join creators</span>
                </div>
              </div>

              {/* Bento Card 2: Platform Stats & Engine */}
              <div className="md:col-span-5 relative overflow-hidden rounded-3xl p-6 md:p-8 bg-zinc-950/60 backdrop-blur-xl border border-white/[0.08] flex flex-col justify-between">
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                      Live Telemetry
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      100% Operational
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-2xl font-display font-black text-white">{(games.length + 14200).toLocaleString()}+</div>
                      <div className="text-[11px] font-mono text-zinc-400 mt-0.5">Sessions Run</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-2xl font-display font-black text-emerald-400">&lt; 15ms</div>
                      <div className="text-[11px] font-mono text-zinc-400 mt-0.5">Canvas Latency</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-4 border-t border-white/[0.06] relative z-10">
                  <span>HTML5 / Canvas Dual Runtime</span>
                  <button 
                    onClick={() => setActiveTab("about")}
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Learn more &rarr;
                  </button>
                </div>
              </div>

            </div>

            {/* Fresh Picks Section Header */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-white">
                    Fresh Picks & Community Games
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    Play instantly in browser without downloads or installation
                  </p>
                </div>
              </div>

              <button 
                onClick={() => { setSelectedTag(null); setActiveTab("games"); }}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all"
              >
                Browse All ({games.length}) &rarr;
              </button>
            </div>

            {/* Dynamic Live Roster - Rendered using 21st.dev modern cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {games.slice(0, 6).map((g) => (
                <ModernGameCard
                  key={g.id}
                  game={g}
                  onPlay={(id) => launchGame(id)}
                  isLiked={likedGames.includes(g.id)}
                  onToggleLike={(id) => toggleLike(id)}
                />
              ))}
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            SECTION: GAMES LISTING ARCHIVE (Indie Gems)
           ------------------------------------------------------------- */}
        {activeTab === "games" && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Catalog Banner Specs with Glassmorphism */}
            <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-zinc-950/60 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                      CATALOG
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {filteredGames.length} of {games.length} titles available
                    </span>
                  </div>
                  <h1 className="font-display font-black text-2xl md:text-4xl text-white tracking-tight">
                    Explore Experiences
                  </h1>
                  <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
                    Browse indie creations, retro arcade recreations, and user-compiled HTML5 games.
                  </p>
                </div>

                {/* Filter Search Input */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by title, tag, creator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category and Sorter Controls Bar */}
            <CategoryBar
              categories={allTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              totalGames={games.length}
            />

            {/* Grid Games list */}
            {filteredGames.length === 0 ? (
              <div className="rounded-3xl p-12 bg-zinc-950/60 backdrop-blur-xl border border-white/[0.08] text-center flex flex-col items-center gap-3">
                <ShieldAlert className="w-10 h-10 text-amber-400 mb-1" />
                <h3 className="font-display font-bold text-lg text-white">No Matching Experiences Found</h3>
                <p className="text-xs text-zinc-400 font-sans max-w-sm">
                  We couldn't find any games matching "{searchQuery}" with the current filters. Try resetting the criteria.
                </p>
                <button 
                  onClick={() => { setSelectedTag(null); setSearchQuery(""); setSelectedRating(0); }}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredGames.map((g) => (
                  <ModernGameCard
                    key={g.id}
                    game={g}
                    onPlay={(id) => launchGame(id)}
                    isLiked={likedGames.includes(g.id)}
                    onToggleLike={(id) => toggleLike(id)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------------
            SECTION: ABOUT CREATOR MISSION PAGE
           ------------------------------------------------------------- */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-fadeIn">
            
            {/* Mission display core (21st.dev Glass Bento) */}
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-zinc-950/60 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                    ABOUT THE PLATFORM
                  </span>
                  <span className="text-xs font-mono text-zinc-400">NexSamble Collective</span>
                </div>

                <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight">
                  NexSamble.
                </h1>

                <p className="text-sm md:text-base text-zinc-300 font-sans leading-relaxed max-w-2xl">
                  We are a passionate team dedicated to building accessible, high-performance web gaming tools and collaborative sandboxes. This project is created primarily by <b>Hss</b>, with special thanks to <b>Atharv Sharma</b>.
                </p>
              </div>
            </div>

            {/* Bento pillars block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Pillar 1 */}
              <div className="rounded-2xl p-6 bg-zinc-950/60 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col justify-between gap-6 group">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    01 // CREATE
                  </span>
                  <Code className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">Create & Publish</h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Upload standalone HTML5 games, showcase your projects, inspect code files in real-time, and build your audience.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-2xl p-6 bg-zinc-950/60 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between gap-6 group">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    02 // CONNECT
                  </span>
                  <Users className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">Connect & Share</h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Track developer profiles, leave game ratings and reviews, follow creators, and discover what your peers are building.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-2xl p-6 bg-zinc-950/60 backdrop-blur-xl border border-white/[0.08] hover:border-amber-500/30 transition-all flex flex-col justify-between gap-6 group">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    03 // DISCOVER
                  </span>
                  <Star className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">Play & Discover</h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Play retro arcade simulations, tweak physics variables in real time, and enjoy zero-install browser gaming.
                  </p>
                </div>
              </div>

            </div>

            {/* CTA action card */}
            <div className="rounded-3xl p-8 bg-gradient-to-r from-emerald-500/20 via-zinc-900/60 to-zinc-900/60 backdrop-blur-xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-md">
                <h3 className="font-display font-bold text-2xl text-white">Ready to Deploy Games?</h3>
                <p className="text-xs md:text-sm text-zinc-300 mt-2 leading-relaxed">
                  Join our creator community, upload your ZIP bundles, and test games in our sandbox compiler.
                </p>
              </div>
              <button 
                onClick={() => {
                  setAuthHandle("");
                  setIsSignUpMode(true);
                  setShowAuthModal(true);
                }}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all active:scale-95 whitespace-nowrap"
              >
                Create Account Handle
              </button>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            SECTION: DYNAMIC COMPILER STUDIO UPLOADER (UPLOAD Tab)
           ------------------------------------------------------------- */}
        {activeTab === "studio" && (
          <div className="max-w-3xl mx-auto flex flex-col gap-6 animate-fadeIn">
            
            <form onSubmit={handleHtmlUpload} className="rounded-3xl p-6 md:p-8 bg-zinc-950/70 backdrop-blur-xl border border-white/[0.08] shadow-2xl flex flex-col gap-6">
              
              <div className="text-center flex flex-col items-center border-b border-white/[0.06] pb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <Code className="w-6 h-6 text-zinc-950" />
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  SANDBOX ENGINE DEPLOYER
                </span>
                <h1 className="font-display font-black text-2xl md:text-3xl text-white mt-1 leading-tight tracking-tight">Deploy HTML Game</h1>
                <p className="text-xs text-zinc-400 font-sans mt-2 max-w-md leading-relaxed">
                  Drag and drop standalone HTML5 application bundles or ZIP archives directly. Uploaded games will register and execute live.
                </p>
              </div>

              {/* Supabase Connection indications bar */}
              <div className="border border-zinc-800 bg-zinc-900/40 p-4 flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      Server Status: 
                      <span className={isSupabaseConfigured ? "text-emerald-400 ml-1" : "text-amber-400 ml-1"}>
                        {isSupabaseConfigured ? "SYNCHRONIZED (ONLINE)" : "LOCAL FALLBACK ONLY"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {htmlUploadSuccess ? (
                <div className="bg-emerald-950/20 border-2 border-emerald-500/35 p-6 text-center animate-fadeIn flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-white uppercase text-lg leading-none">Game Registered Live!</h4>
                    <p className="text-xs text-stone-400 mt-2 font-sans">
                      Standalone module <b>{uploadedGameMeta?.title || "My Game"}</b> successfully compiled. 
                    </p>
                  </div>
                  <div className="flex gap-2.5 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (uploadedGameMeta) {
                          setSelectedGameId(uploadedGameMeta.id);
                          setGameState("playing");
                          setActiveTab("play");
                          setHtmlUploadSuccess(false);
                        }
                      }}
                      className="bg-[#c3f400] text-black border border-black font-display font-extrabold text-xs uppercase px-4 py-2"
                    >
                      Play Sandbox Game
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHtmlUploadSuccess(false);
                        setHtmlTitle("");
                        setHtmlCode("");
                        setHtmlDesc("");
                        setIsUploadedZip(false);
                        setUploadedZipBase64("");
                        setVirtualFileMap(null);
                        setSelectedPreviewFile(null);
                      }}
                      className="bg-stone-900 text-stone-400 border border-zinc-800 text-xs py-2 px-4 uppercase font-mono"
                    >
                      Compile Another
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {htmlUploadError && (
                    <div className="bg-red-950/30 border border-red-500/25 p-3 font-mono text-xs text-red-300">
                      ERR_COMPILE: {htmlUploadError}
                    </div>
                  )}

                  {/* Title and Description fields */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-black uppercase text-[#c4c9ac]">Game Title *</label>
                      <input
                        type="text"
                        required
                        value={htmlTitle}
                        onChange={(e) => setHtmlTitle(e.target.value)}
                        placeholder="e.g. Laser Odyssey"
                        className="bg-stone-900 border border-zinc-700 p-2.5 text-xs text-white uppercase font-mono tracking-wide placeholder:opacity-20"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-black uppercase text-[#c4c9ac]">Description Summary</label>
                      <input
                        type="text"
                        value={htmlDesc}
                        onChange={(e) => setHtmlDesc(e.target.value)}
                        placeholder="e.g. Smash sweeping energy arrays with real-time mouse clicks."
                        className="bg-stone-900 border border-zinc-700 p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Dynamic checklist/badge selector for available tags in alphabetical order */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-black uppercase text-[#c4c9ac]">Select Game Tags *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3.5 bg-stone-900 border border-zinc-700">
                      {getAvailableUploadTags().map(tag => {
                        const isSelected = selectedUploadTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleUploadTag(tag)}
                            className={`text-[10px] font-mono font-bold px-2 py-1.5 tracking-tight transition-all border text-left flex items-center justify-between ${
                              isSelected 
                                ? "bg-[#c3f400] text-black border-black font-black" 
                                : "bg-stone-950 text-stone-400 border-zinc-800 hover:text-white"
                            }`}
                          >
                            <span>#{tag.toUpperCase()}</span>
                            {isSelected && <span className="text-[8px] bg-black text-[#c3f400] px-1 font-sans">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[9px] text-stone-500 font-mono">Select one or more tags in analytical ordered index to categorize your sandbox game module.</span>
                  </div>

                  {/* Thumbnail Image File Select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-black uppercase text-[#c4c9ac]">Game Thumbnail / Banner Image *</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-stone-900 border border-zinc-700 p-3">
                      <div className="w-24 h-16 bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                        {htmlBannerUrl ? (
                          <img src={htmlBannerUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-zinc-600 font-mono">No Image</span>
                        )}
                      </div>
                      <div className="w-full sm:flex-1 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => document.getElementById("thumbnail-file-upload-input")?.click()}
                          className="w-full bg-stone-950 text-white hover:bg-stone-900 border border-zinc-800 text-xs font-mono py-2 px-3 hover:border-[#c3f400] transition-all uppercase text-center"
                        >
                          Choose image file
                        </button>
                        <input 
                          type="file" 
                          id="thumbnail-file-upload-input" 
                          accept="image/*" 
                          onChange={handleThumbnailSelect} 
                          className="hidden" 
                        />
                        <span className="text-[9px] text-stone-500 font-mono">PNG, JPG, WebP, SVG automatic base64 visual mapping.</span>
                      </div>
                    </div>
                  </div>

                  {/* Code Editor dragging and loading workspace */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-black uppercase text-[#c4c9ac]">Standalone HTML Game Code *</label>
                    
                    {/* Drag and drop interactive backdrop - supports BOTH dragging & selection file input click */}
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                      onClick={() => document.getElementById("html-file-upload-input")?.click()}
                      className="border-2 border-dashed border-zinc-700 rounded-none bg-stone-900/60 p-4 text-center cursor-pointer hover:border-[#c3f400] transition-colors flex flex-col items-center justify-center gap-2 mb-2"
                      title="Click to select file or drag & drop standalone HTML files or game .zip archives here"
                    >
                      <input 
                        type="file" 
                        id="html-file-upload-input" 
                        accept=".html,.txt,.zip" 
                        onChange={handleFileSelect} 
                        className="hidden" 
                      />
                      <Upload className="w-6 h-6 text-stone-500" />
                      <span className="text-[10px] font-mono font-bold text-zinc-400">Drag & drop standalone .html bundle or game .zip archive here OR click to browse files</span>
                    </div>

                    {/* Interactive ZIP Archive Structure Explorer */}
                    {isUploadedZip && virtualFileMap && (
                      <div className="border-2 border-dashed border-zinc-800 bg-[#121212] p-4 flex flex-col gap-4 mb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] animate-pulse" />
                              <span className="font-mono text-xs font-black text-white uppercase tracking-wider">📦 ZIP Anatomy Explorer</span>
                            </div>
                            
                            {/* Seamless view mode buttons */}
                            <div className="flex items-center gap-1 border border-zinc-800 p-0.5 bg-black rounded-none">
                              <button
                                type="button"
                                onClick={() => setZipViewMode("explorer")}
                                className={`font-mono text-[9px] uppercase px-3 py-1 transition-all flex items-center gap-1 ${
                                  zipViewMode === "explorer"
                                    ? "bg-stone-900 text-[#c3f450] font-black border border-zinc-800"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                              >
                                📁 File Browser
                              </button>
                              <button
                                type="button"
                                onClick={() => setZipViewMode("playtest")}
                                className={`font-mono text-[9px] uppercase px-3 py-1 transition-all flex items-center gap-1 relative ${
                                  zipViewMode === "playtest"
                                    ? "bg-[#c3f400] text-black font-black border border-black"
                                    : "text-zinc-400 hover:text-[#c3f400]"
                                }`}
                              >
                                🎮 Live Arena Playtest
                                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                                </span>
                              </button>
                            </div>
                          </div>
                          
                          <span className="text-[9px] font-mono text-zinc-400 bg-black border border-zinc-800 px-2.5 py-1">
                            {Object.keys(virtualFileMap.files).length} FILES DETECTED
                          </span>
                        </div>

                        {/* Summary Stats counts */}
                        <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-mono">
                          <div className="border border-zinc-800 bg-stone-900/50 p-2">
                            <span className="block text-zinc-500 uppercase">HTML</span>
                            <span className="text-sm font-black text-[#c3f400]">{virtualFileMap.htmlFiles.length}</span>
                          </div>
                          <div className="border border-zinc-800 bg-stone-900/50 p-2">
                            <span className="block text-zinc-500 uppercase">CSS</span>
                            <span className="text-sm font-black text-[#ff571a]">{virtualFileMap.cssFiles.length}</span>
                          </div>
                          <div className="border border-zinc-800 bg-stone-900/50 p-2">
                            <span className="block text-zinc-500 uppercase">JS Logic</span>
                            <span className="text-sm font-black text-white">{virtualFileMap.jsFiles.length}</span>
                          </div>
                          <div className="border border-zinc-800 bg-stone-900/50 p-2">
                            <span className="block text-zinc-500 uppercase">Assets</span>
                            <span className="text-sm font-black text-zinc-400">{virtualFileMap.otherFiles.length}</span>
                          </div>
                        </div>

                        {/* Interactive File Explorer Layout: Lists on Left, Inspect views on Right */}
                        {zipViewMode === "explorer" ? (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-1.5">
                            
                            {/* Left Panel: Directories structure */}
                            <div className="md:col-span-5 max-h-[280px] overflow-y-auto custom-scrollbar border border-zinc-800 p-2 bg-stone-950 flex flex-col gap-2.5">
                              
                              {/* Final Extracted Folder Structure Tree */}
                              {extractedStructure && (
                                <div className="border border-dashed border-zinc-800 bg-[#0c0c0c] p-2 flex flex-col gap-1.5 rounded-sm">
                                  <span className="text-[8px] font-mono text-zinc-400 font-[#c4c9ac] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-[#c3f400]" /> Extracted Server Directory Tree:
                                  </span>
                                  <div className="max-h-[150px] overflow-auto custom-scrollbar bg-black/55 p-2 border border-zinc-900 rounded-sm">
                                    <FolderTreeRenderer node={extractedStructure} />
                                  </div>
                                </div>
                              )}

                              {/* Primary entry point highlights */}
                              {virtualFileMap.entryPoint && (
                                <div className="border border-dashed border-[#c3f400]/30 bg-[#c3f400]/5 p-2 flex flex-col gap-1">
                                  <span className="text-[8px] font-mono text-[#c4c9ac] font-bold uppercase tracking-widest">
                                    🎯 Primary App Entrypoint:
                                  </span>
                                  <div 
                                    onClick={() => {
                                      setSelectedPreviewFile(virtualFileMap.entryPoint);
                                      setActiveCodeViewerFile(virtualFileMap.entryPoint);
                                    }}
                                    className={`flex items-center justify-between p-1 px-1.5 cursor-pointer border text-[11px] font-mono transition-all ${
                                      selectedPreviewFile?.path === virtualFileMap.entryPoint.path
                                        ? "bg-[#c3f400] text-black border-black font-semibold" 
                                        : "bg-stone-900 hover:bg-stone-850 text-white border-zinc-800"
                                    }`}
                                  >
                                    <span className="truncate">{virtualFileMap.entryPoint.path}</span>
                                    <span className="text-[8px] bg-black text-[#c3f400] px-1 h-3.5 flex items-center font-sans">PORTAL</span>
                                  </div>
                                </div>
                              )}

                              {/* HTML Files list */}
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  onClick={() => setExpandedFileGroups({ ...expandedFileGroups, html: !expandedFileGroups.html })}
                                  className="flex items-center justify-between w-full text-left font-mono text-[9px] uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-1 mb-1 focus:outline-none hover:text-white"
                                >
                                  <span className="flex items-center gap-1">
                                    {expandedFileGroups.html ? <FolderOpen className="w-3.5 h-3.5 text-[#c3f400]" /> : <Folder className="w-3.5 h-3.5 text-zinc-500" />}
                                    HTML Markups ({virtualFileMap.htmlFiles.length})
                                  </span>
                                  <span className="text-[8px] text-[#c4c9ac]">{expandedFileGroups.html ? "[-]" : "[+]"}</span>
                                </button>

                                {expandedFileGroups.html && (
                                  <div className="flex flex-col pl-2 border-l border-zinc-900 ml-1.5 py-0.5 gap-0.5">
                                    {virtualFileMap.htmlFiles.length === 0 ? (
                                      <span className="text-[9px] font-mono text-zinc-600 italic">No markups found</span>
                                    ) : (
                                      virtualFileMap.htmlFiles.map(f => (
                                        <div
                                          key={f.path}
                                          onClick={() => {
                                            setSelectedPreviewFile(f);
                                            setActiveCodeViewerFile(f);
                                          }}
                                          className={`flex items-center gap-1.5 p-1 rounded-sm cursor-pointer font-mono text-[11px] transition-colors hover:bg-zinc-900 hover:text-white ${
                                            selectedPreviewFile?.path === f.path ? "text-[#c3f400] font-black bg-zinc-900/80" : "text-stone-300"
                                          }`}
                                        >
                                          <FileCode className="w-3 h-3 text-[#c3f400] shrink-0" />
                                          <span className="truncate">{f.path}</span>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* JS Files list */}
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  onClick={() => setExpandedFileGroups({ ...expandedFileGroups, js: !expandedFileGroups.js })}
                                  className="flex items-center justify-between w-full text-left font-mono text-[9px] uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-1 mb-1 focus:outline-none hover:text-white"
                                >
                                  <span className="flex items-center gap-1">
                                    {expandedFileGroups.js ? <FolderOpen className="w-3.5 h-3.5 text-[#ff571a]" /> : <Folder className="w-3.5 h-3.5 text-zinc-500" />}
                                    JavaScript Scripts ({virtualFileMap.jsFiles.length})
                                  </span>
                                  <span className="text-[8px] text-[#c4c9ac]">{expandedFileGroups.js ? "[-]" : "[+]"}</span>
                                </button>

                                {expandedFileGroups.js && (
                                  <div className="flex flex-col pl-2 border-l border-zinc-900 ml-1.5 py-0.5 gap-0.5">
                                    {virtualFileMap.jsFiles.length === 0 ? (
                                      <span className="text-[9px] font-mono text-zinc-600 italic">No logic found</span>
                                    ) : (
                                      virtualFileMap.jsFiles.map(f => (
                                        <div
                                          key={f.path}
                                          onClick={() => {
                                            setSelectedPreviewFile(f);
                                            setActiveCodeViewerFile(f);
                                          }}
                                          className={`flex items-center gap-1.5 p-1 rounded-sm cursor-pointer font-mono text-[11px] transition-colors hover:bg-zinc-900 hover:text-white ${
                                            selectedPreviewFile?.path === f.path ? "text-[#ff571a] font-black bg-zinc-900/80" : "text-stone-300"
                                          }`}
                                        >
                                          <Code className="w-3 h-3 text-[#ff571a] shrink-0" />
                                          <span className="truncate">{f.path}</span>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* CSS Files list */}
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  onClick={() => setExpandedFileGroups({ ...expandedFileGroups, css: !expandedFileGroups.css })}
                                  className="flex items-center justify-between w-full text-left font-mono text-[9px] uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-1 mb-1 focus:outline-none hover:text-white"
                                >
                                  <span className="flex items-center gap-1">
                                    {expandedFileGroups.css ? <FolderOpen className="w-3.5 h-3.5 text-cyan-400" /> : <Folder className="w-3.5 h-3.5 text-zinc-500" />}
                                    Styles (.css) ({virtualFileMap.cssFiles.length})
                                  </span>
                                  <span className="text-[8px] text-[#c4c9ac]">{expandedFileGroups.css ? "[-]" : "[+]"}</span>
                                </button>

                                {expandedFileGroups.css && (
                                  <div className="flex flex-col pl-2 border-l border-zinc-900 ml-1.5 py-0.5 gap-0.5">
                                    {virtualFileMap.cssFiles.length === 0 ? (
                                      <span className="text-[9px] font-mono text-zinc-600 italic">No stylings found</span>
                                    ) : (
                                      virtualFileMap.cssFiles.map(f => (
                                        <div
                                          key={f.path}
                                          onClick={() => {
                                            setSelectedPreviewFile(f);
                                            setActiveCodeViewerFile(f);
                                          }}
                                          className={`flex items-center gap-1.5 p-1 rounded-sm cursor-pointer font-mono text-[11px] transition-colors hover:bg-zinc-900 hover:text-white ${
                                            selectedPreviewFile?.path === f.path ? "text-cyan-400 font-black bg-zinc-900/80" : "text-stone-300"
                                          }`}
                                        >
                                          <FileCode className="w-3 h-3 text-cyan-400 shrink-0" />
                                          <span className="truncate">{f.path}</span>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Assets and Media list */}
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  onClick={() => setExpandedFileGroups({ ...expandedFileGroups, other: !expandedFileGroups.other })}
                                  className="flex items-center justify-between w-full text-left font-mono text-[9px] uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-1 mb-1 focus:outline-none hover:text-white"
                                >
                                  <span className="flex items-center gap-1">
                                    {expandedFileGroups.other ? <FolderOpen className="w-3.5 h-3.5 text-zinc-400" /> : <Folder className="w-3.5 h-3.5 text-zinc-500" />}
                                    Other Assets ({virtualFileMap.otherFiles.length})
                                  </span>
                                  <span className="text-[8px] text-[#c4c9ac]">{expandedFileGroups.other ? "[-]" : "[+]"}</span>
                                </button>

                                {expandedFileGroups.other && (
                                  <div className="flex flex-col pl-2 border-l border-zinc-900 ml-1.5 py-0.5 gap-0.5">
                                    {virtualFileMap.otherFiles.length === 0 ? (
                                      <span className="text-[9px] font-mono text-zinc-600 italic">No details</span>
                                    ) : (
                                      virtualFileMap.otherFiles.map(f => (
                                        <div
                                          key={f.path}
                                          onClick={() => setSelectedPreviewFile(f)}
                                          className={`flex items-center gap-1.5 p-1 rounded-sm cursor-pointer font-mono text-[11px] transition-colors hover:bg-zinc-900 hover:text-white ${
                                            selectedPreviewFile?.path === f.path ? "text-violet-400 font-bold bg-zinc-900/80" : "text-stone-400"
                                          }`}
                                        >
                                          <span className="w-1 h-1 rounded-full bg-zinc-500 shrink-0" />
                                          <span className="truncate text-xs">{f.path}</span>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>

                            </div>

                            {/* Right Panel: Content viewer */}
                            <div className="md:col-span-7 flex flex-col border border-zinc-800 bg-stone-950 p-2 max-h-[280px] overflow-y-auto custom-scrollbar">
                              {selectedPreviewFile ? (
                                <div className="flex flex-col gap-2 h-full">
                                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                                    <div className="flex flex-col min-w-0 max-w-[120px] sm:max-w-xs">
                                      <span className="font-mono text-[11px] font-black text-white shrink-0 truncate">{selectedPreviewFile.name}</span>
                                      <span className="font-mono text-[8px] text-zinc-500 truncate">{selectedPreviewFile.mimeType}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {!selectedPreviewFile.isBinary && (
                                        <button
                                          type="button"
                                          onClick={() => setActiveCodeViewerFile(selectedPreviewFile)}
                                          className="bg-[#c3f400] hover:bg-[#b0dc00] text-black font-mono text-[9px] font-black px-2 py-0.5 uppercase transition-all tracking-wider"
                                        >
                                          🔬 INSPECT CODE
                                        </button>
                                      )}
                                      <span className="text-[8px] tracking-widest font-mono border border-zinc-850 bg-stone-900 text-zinc-400 px-2 py-0.5 shrink-0">
                                        {selectedPreviewFile.isBinary ? "BINARY DATA" : "TEXT EXCODED"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex-1 bg-stone-900/40 p-2 border border-zinc-900 rounded-none overflow-auto max-h-[200px] custom-scrollbar">
                                    {selectedPreviewFile.isBinary ? (
                                      selectedPreviewFile.mimeType.startsWith("image/") ? (
                                        <div className="flex flex-col items-center justify-center py-4 bg-zinc-950/25 min-h-[140px] gap-2 rounded">
                                          <img 
                                            src={selectedPreviewFile.dataUrl} 
                                            alt={selectedPreviewFile.name} 
                                            referrerPolicy="no-referrer"
                                            className="max-h-[100px] max-w-full object-contain border border-zinc-850 bg-[linear-gradient(45deg,#1c1c1c_25%,transparent_25%),linear-gradient(-45deg,#1c1c1c_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1c1c1c_75%),linear-gradient(-45deg,transparent_75%,#1c1c1c_75%)] bg-[size:10px_10px] bg-[position:0_0,0_5px,5px_-5px,-5px_0px] p-2"
                                          />
                                          <span className="text-[10px] font-mono text-zinc-500">{selectedPreviewFile.name}</span>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center justify-center p-8 text-center text-[10px] font-mono text-zinc-500 gap-1 h-full min-h-[120px]">
                                          <span>Content stream formatted in static binaries files.</span>
                                          <span className="text-[8px] bg-zinc-950 px-1.5 py-0.5 mt-1 border border-zinc-900 text-stone-500">BASE64_STREAM</span>
                                        </div>
                                      )
                                    ) : (
                                      <pre className="text-[10px] font-mono text-emerald-400 leading-normal whitespace-pre">
                                        {selectedPreviewFile.content || "/* This file is empty */"}
                                      </pre>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500 gap-2 h-full min-h-[220px]">
                                  <Eye className="w-8 h-8 opacity-20" />
                                  <div className="font-mono text-[9px] font-black uppercase tracking-wider">Audit Panel Ready</div>
                                  <span className="text-[9px] text-zinc-500 max-w-[180px] leading-relaxed font-sans">
                                    Select file in index deck to evaluate script contents before deployment.
                                  </span>
                                </div>
                              )}
                            </div>

                          </div>
                        ) : (
                          /* High-fidelity Inline Playtest Arena */
                          <div className="flex flex-col gap-4 pt-1.5 animate-fadeIn">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-zinc-800 bg-stone-900/40 p-3 gap-2">
                              <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="font-mono text-xs text-white uppercase font-black">Playtest Core: Sandbox Connected</span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => setPlaytestKey(prev => prev + 1)}
                                  className="bg-black hover:bg-zinc-900 border border-zinc-800 text-[#c3f400] text-[10px] uppercase font-mono font-bold px-3 py-1.5 flex items-center gap-1.5 transition-all text-center select-none"
                                  title="Reload sandboxed Blob container state"
                                >
                                  🔁 Restart / Reload
                                </button>
                                <span className="text-[9px] font-mono text-zinc-500 bg-black/60 border border-zinc-900 px-2 py-1 leading-none uppercase">
                                  BLOB_READY: {zipBlobUrl ? "OK" : "PENDING"}
                                </span>
                              </div>
                            </div>

                             {zipBlobUrl ? (
                               <div className="flex flex-col lg:flex-row gap-4 w-full h-[500px]">
                                 <div className={`border-2 border-[#c3f400] bg-black relative flex flex-col items-center transition-all h-full ${isConsoleCollapsed ? "w-full" : "w-full lg:w-2/3"}`}>
                                   <iframe
                                     key={playtestKey}
                                     id="studio-playtest-iframe"
                                     src={zipBlobUrl}
                                     title="ZIP Live Studio Playtest"
                                     className="w-full h-full bg-black border-none"
                                     sandbox="allow-scripts allow-same-origin allow-popups"
                                     referrerPolicy="no-referrer"
                                     allow="fullscreen"
                                     allowFullScreen={true}
                                   />
                                   <div className="absolute bottom-2 left-2 bg-black/90 border border-zinc-800 px-2.5 py-1 text-[9px] font-mono text-zinc-400 select-none pointer-events-none uppercase">
                                     🎮 Left/Right, Space, or Mouse/Touch controllers active. Click viewport to capture input focus.
                                   </div>
                                 </div>

                                 {/* Live Game Console side panel */}
                                 <div className={`flex flex-col border border-zinc-800 bg-stone-950 font-mono text-xs transition-all h-[500px] lg:h-full relative overflow-hidden select-none ${isConsoleCollapsed ? "w-full lg:w-12 h-[50px] lg:h-full flex items-center justify-center bg-zinc-950" : "w-full lg:w-1/3"}`}>
                                   {isConsoleCollapsed ? (
                                     <button
                                       type="button"
                                       onClick={() => setIsConsoleCollapsed(false)}
                                       className="w-full h-full py-2 px-1 flex flex-row lg:flex-col items-center justify-center gap-2 hover:bg-zinc-900 text-[#c3f400] font-black uppercase text-[10px] select-none border border-transparent"
                                       title="Open Game Console Logs Panel"
                                     >
                                       <span>📟</span>
                                       <span className="lg:[writing-mode:vertical-lr] lg:rotate-180 tracking-widest font-black text-center text-[9px]">CONSOLE ({consoleLogs.length})</span>
                                     </button>
                                   ) : (
                                     <div className="flex flex-col h-full w-full">
                                       {/* Console Header */}
                                       <div className="flex items-center justify-between border-b border-zinc-800 bg-stone-900/60 p-2 shrink-0">
                                         <div className="flex items-center gap-1.5">
                                           <span className="text-[#c3f400] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                             📟 CONSOLE ({consoleLogs.length})
                                           </span>
                                           {consoleLogs.some(l => l.method === "error") && (
                                             <span className="animate-pulse w-2 h-2 rounded-full bg-red-500" title="Errors active!" />
                                           )}
                                         </div>
                                         <button
                                           type="button"
                                           onClick={() => setIsConsoleCollapsed(true)}
                                           className="text-zinc-500 hover:text-white font-black text-[11px] px-1.5 py-0.5 bg-stone-900 border border-zinc-850 rounded-sm hover:border-zinc-750 select-none transition-colors"
                                           title="Minimize Console Panel"
                                         >
                                           ✕
                                         </button>
                                       </div>

                                       {/* Console Filters Bar */}
                                       <div className="flex flex-wrap items-center justify-between border-b border-zinc-900 bg-zinc-950 p-2 gap-1.5 shrink-0">
                                         <div className="flex flex-wrap gap-1">
                                           <button
                                             type="button"
                                             onClick={() => setConsoleLogLevel("all")}
                                             className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider border rounded-sm transition-all ${
                                               consoleLogLevel === "all" ? "bg-[#c3f400] text-black border-[#c3f400] font-bold" : "bg-black text-zinc-500 border-zinc-900 hover:text-zinc-300"
                                             }`}
                                           >
                                             All
                                           </button>
                                           <button
                                             type="button"
                                             onClick={() => setConsoleLogLevel("log")}
                                             className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider border rounded-sm transition-all ${
                                               consoleLogLevel === "log" ? "bg-stone-800 text-stone-200 border-stone-750 font-bold" : "bg-black text-zinc-500 border-zinc-900 hover:text-zinc-300"
                                             }`}
                                           >
                                             Logs
                                           </button>
                                           <button
                                             type="button"
                                             onClick={() => setConsoleLogLevel("info")}
                                             className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider border rounded-sm transition-all ${
                                               consoleLogLevel === "info" ? "bg-cyan-955 text-cyan-400 border-cyan-900 font-bold" : "bg-black text-zinc-500 border-zinc-900 hover:text-cyan-300"
                                             }`}
                                           >
                                             Info
                                           </button>
                                           <button
                                             type="button"
                                             onClick={() => setConsoleLogLevel("warn")}
                                             className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider border rounded-sm transition-all ${
                                               consoleLogLevel === "warn" ? "bg-amber-950 text-amber-400 border-amber-900 font-bold" : "bg-black text-zinc-500 border-zinc-900 hover:text-amber-300"
                                             }`}
                                           >
                                             Warns
                                           </button>
                                           <button
                                             type="button"
                                             onClick={() => setConsoleLogLevel("error")}
                                             className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider border rounded-sm transition-all ${
                                               consoleLogLevel === "error" ? "bg-red-950 text-red-400 border-red-900 font-bold" : "bg-black text-zinc-500 border-zinc-900 hover:text-red-400"
                                             }`}
                                           >
                                             Errors
                                           </button>
                                         </div>

                                         <button
                                           type="button"
                                           onClick={() => setConsoleLogs([])}
                                           className="px-1.5 py-0.5 text-[8.5px] uppercase tracking-wider bg-black border border-zinc-900 hover:border-zinc-750 hover:text-red-400 text-zinc-400 shrink-0 font-bold select-none transition-all rounded-sm"
                                           title="Clear Console logs"
                                         >
                                           CLEAR
                                         </button>
                                       </div>

                                       {/* Console Search Field */}
                                       <div className="flex items-center gap-1.5 bg-black border-b border-zinc-900 px-2.5 py-1 shrink-0">
                                         <span className="text-zinc-600 text-[9px] select-none uppercase font-black shrink-0">Filter:</span>
                                         <input
                                           type="text"
                                           value={consoleFilter}
                                           onChange={(e) => setConsoleFilter(e.target.value)}
                                           placeholder="Search keywords, stack..."
                                           className="bg-stone-900/60 border border-zinc-900 focus:border-zinc-750 focus:outline-none p-1 text-[10px] text-zinc-200 placeholder-zinc-700 w-full rounded-sm font-mono"
                                         />
                                         {consoleFilter && (
                                           <button
                                             type="button"
                                             onClick={() => setConsoleFilter("")}
                                             className="text-zinc-500 hover:text-white p-0.5 text-[10px] select-none"
                                           >
                                             ✕
                                           </button>
                                         )}
                                       </div>

                                       {/* Logs List Area */}
                                       <div className="flex-1 bg-stone-950 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-1 select-text scroll-smooth max-h-[380px]">
                                         {(() => {
                                           const filtered = consoleLogs.filter(log => {
                                             if (consoleLogLevel !== "all" && log.method !== consoleLogLevel) return false;
                                             if (consoleFilter) {
                                               const query = consoleFilter.toLowerCase();
                                               return log.args.some(arg => {
                                                 if (typeof arg === "string") return arg.toLowerCase().includes(query);
                                                 try {
                                                   return JSON.stringify(arg).toLowerCase().includes(query);
                                                 } catch (_) {
                                                   return false;
                                                 }
                                               });
                                             }
                                             return true;
                                           });

                                           if (filtered.length === 0) {
                                             return (
                                               <div className="flex flex-col items-center justify-center text-zinc-600 italic py-16 gap-1 h-full select-none">
                                                 <span className="text-sm">📟</span>
                                                 <span className="text-[9px] uppercase font-bold tracking-wider">
                                                   {consoleLogs.length === 0 ? "No active logs compiled." : "No logs match filter."}
                                                 </span>
                                                 <span className="text-[8px] text-zinc-600 max-w-[150px] leading-relaxed text-center font-sans mt-1">
                                                   Play the game, trigger controls, or trigger logs to watch standard output stream.
                                                 </span>
                                               </div>
                                             );
                                           }

                                           return filtered.map((log) => {
                                             let theme = "text-zinc-400 border-zinc-900 bg-zinc-900/10";
                                             let icon = "●";

                                             if (log.method === "info") {
                                               theme = "text-cyan-400 border-cyan-950 bg-cyan-950/15";
                                               icon = "ℹ";
                                             } else if (log.method === "warn") {
                                               theme = "text-amber-400 border-amber-950 bg-amber-950/10";
                                               icon = "⚠";
                                             } else if (log.method === "error") {
                                               theme = "text-red-400 border-red-950/70 bg-red-950/15 border-l-2 border-l-red-500 shadow-[inset_1px_0_0_0_#ef4444]";
                                               icon = "✕";
                                             }

                                             return (
                                               <div 
                                                 key={log.id} 
                                                 className={`p-1.5 border border-dashed rounded-sm flex flex-col gap-1 transition-all hover:bg-zinc-900/40 ${theme}`}
                                               >
                                                 <div className="flex items-start justify-between gap-2">
                                                   <div className="flex items-start gap-1.5 text-[9.5px] leading-relaxed break-keep font-semibold font-mono tracking-tight flex-1">
                                                     <span className="shrink-0 select-none opacity-80">{icon}</span>
                                                     <div className="flex flex-col gap-0.5 break-all">
                                                       {log.args.map((arg, idx) => (
                                                         <span key={idx} className="whitespace-pre-wrap select-text selection:bg-zinc-850 font-mono">
                                                           {arg && typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)}
                                                         </span>
                                                       ))}
                                                     </div>
                                                   </div>
                                                   <span className="text-[7.5px] text-zinc-650 shrink-0 select-none pt-0.5 font-mono">
                                                     {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                                   </span>
                                                 </div>
                                               </div>
                                             );
                                           });
                                         })()}
                                       </div>
                                     </div>
                                   )}
                                 </div>
                               </div>
                             ) : (
                              <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-stone-900/20 rounded-none p-12 text-center text-zinc-500 gap-2 h-[410px]">
                                <RotateCw className="w-8 h-8 opacity-20 animate-spin" />
                                <div className="font-mono text-[10px] font-black uppercase tracking-wider">Generating Real-time Sandbox Blob</div>
                                <span className="text-[10px] text-zinc-550 max-w-[220px] leading-relaxed font-sans">
                                  Inlining ZIP file structures and compiling standalone virtual bundle elements.
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {!isUploadedZip ? (
                      <textarea
                        required
                        rows={12}
                        value={htmlCode}
                        onChange={(e) => setHtmlCode(e.target.value)}
                        placeholder="<!DOCTYPE html><html><head><style>...</style></head><body><script>...</script></body></html>"
                        className="bg-stone-950 border-2 border-black p-3.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-[#c3f400] custom-scrollbar leading-relaxed"
                      />
                    ) : (
                      <div className="text-zinc-500 text-[10px] font-mono border border-zinc-900 bg-zinc-950/40 p-3 italic">
                        ● ZIP bundle archive loaded. Standalone code manual editing disabled (ZIP files structure is compiled dynamically).
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={htmlBuilderLoading}
                    className="w-full mt-2 bg-[#ff571a] text-black border-2 border-black font-display font-black uppercase tracking-wide text-xs py-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#fff] active:translate-y-0 transition-all flex items-center justify-center gap-2"
                  >
                    {htmlBuilderLoading ? (
                      <>
                        <RotateCw className="w-4 h-4 text-black animate-spin" />
                        COMPILING CODE NODES...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-black" />
                        COMPILE & DEPLOY MODULE
                      </>
                    )}
                  </button>

                </div>
              )}

            </form>

          </div>
        )}

        {/* -------------------------------------------------------------
            SECTION: PLAY MODE CONSOLE INTERACTIVE WORKSPACE
           ------------------------------------------------------------- */}
        {activeTab === "play" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Left Column: Console Frame & Sliders */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              
              {/* Modern Glass Game Board Container */}
              <div className="rounded-3xl overflow-hidden bg-zinc-950/70 backdrop-blur-xl border border-white/[0.08] shadow-2xl relative">
                
                {/* Board Active Header information bars */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b border-white/[0.06] bg-zinc-900/40">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <h1 className="font-display font-bold text-lg md:text-xl text-white leading-tight">{activeGame.title}</h1>
                      <p className="text-[11px] font-mono text-zinc-400 mt-0.5">by @{activeGame.creator} &bull; {activeGame.rating}% rating</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg leading-none">
                      ● {activeGame.activePlayers.toLocaleString()} CCU
                    </span>
                    <button 
                      onClick={toggleFullscreen}
                      className="p-2 rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all"
                      title="Toggle Fullscreen"
                    >
                      {isStageFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => toggleLike(activeGame.id)}
                      className={`p-2 rounded-xl border transition-all ${likedGames.includes(activeGame.id) ? "border-rose-500/30 bg-rose-500/10 text-rose-400" : "border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white"}`}
                      title="Favorite submission"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Display Area for Active gameplay block */}
                <div 
                  id="game-stage-screen"
                  className="bg-[#05030a] min-h-[340px] flex items-center justify-center relative select-none overflow-hidden"
                >
                  {gameState === "idle" && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                      <img src={activeGame.bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none" />
                      
                      <div className="relative z-10 max-w-sm">
                        <h2 className="font-display font-black text-2xl text-[#c3f400] uppercase mb-1">{activeGame.title}</h2>
                        <p className="text-xs text-stone-400 font-sans mb-6 capitalize leading-relaxed">{activeGame.longDescription || activeGame.description}</p>
                        
                        <div className="flex gap-2.5 justify-center">
                          <button
                            onClick={triggerStartGame}
                            className="bg-[#c3f400] text-black border-2 border-black font-display font-black text-xs uppercase px-6 py-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#fff]"
                          >
                            Launch Sandbox Console
                          </button>

                          {(activeGame.id === "space-odyssey" || activeGame.id === "sandbox-studio") && (
                            <button
                              onClick={() => {
                                setAutopilotActive(true);
                                triggerStartGame();
                              }}
                              className="bg-stone-900 text-stone-300 border border-zinc-800 font-mono text-xs px-4 py-3 flex items-center gap-1.5 uppercase hover:border-[#c3f400]"
                            >
                              <Bot className="w-4 h-4 text-[#c3f400]" />
                              AI Pilot Start
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  )}

                  {/* ACTIVE 2D Arcades renderer loops inside modular block wrapper */}
                  <CanvasGames
                    activeGame={activeGame}
                    gameState={gameState}
                    setGameState={setGameState}
                    gameScore={gameScore}
                    setGameScore={setGameScore}
                    gameHighScore={gameHighScore}
                    setGameHighScore={setGameHighScore}
                    playerLives={playerLives}
                    setPlayerLives={setPlayerLives}
                    autopilotActive={autopilotActive}
                    setAutopilotActive={setAutopilotActive}
                    customSpeed={customSpeed}
                    customGravity={customGravity}
                    customSpawnFreq={customSpawnFreq}
                    customShoot={customShoot}
                    customBoss={customBoss}
                    setEntityCount={setEntityCount}
                    isStageFullscreen={isStageFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    zipBlobUrl={zipBlobUrl}
                  />

                  {/* GameOver state frames */}
                  {gameState === "gameover" && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/95 animate-fadeIn">
                      <ShieldAlert className="w-12 h-12 text-[#ff571a] mb-3 animate-bounce" />
                      <h3 className="font-display font-black text-2xl text-[#ff571a] uppercase leading-none mb-1">NODE CRASH TERMINATED</h3>
                      <p className="text-xs text-stone-400 font-sans max-w-xs mb-6">
                        Physics core terminated. Final score registers logged: <span className="font-mono text-[#c3f400] font-bold">{gameScore} pts</span>. High Score: <span className="font-mono text-white font-bold">{gameHighScore[activeGame.id] || 0} pts</span>.
                      </p>
                      <div className="flex gap-2.5">
                        <button onClick={() => setGameState("playing")} className="bg-[#ff571a] text-black border-2 border-black px-4 py-2 text-xs font-display font-extrabold uppercase hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#fff]">
                          Re-Boot Console
                        </button>
                        <button onClick={() => { setGameState("idle"); setAutopilotActive(false); }} className="bg-stone-900 text-stone-400 border border-zinc-800 text-xs py-2 px-4 uppercase font-mono">
                          Parameters Desk
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Win checkpoint frames */}
                  {gameState === "win" && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/95 animate-fadeIn">
                      <div className="w-12 h-12 bg-[#c3f400] border-2 border-black flex items-center justify-center text-black mb-3 select-none">
                        <Star className="w-6 h-6 fill-current" />
                      </div>
                      <h3 className="font-display font-black text-2xl text-[#c3f400] uppercase leading-none mb-1">CRITICAL BOUNTY CAPTURED</h3>
                      <p className="text-xs text-stone-400 font-sans max-w-xs mb-6 font-semibold">
                        Japanese physics array fully parsed. Claimed 100 points sandbox bounty! Core Score: <span className="font-mono text-emerald-400 text-sm font-black">{gameScore} pts</span>.
                      </p>
                      <button onClick={() => { setGameState("idle"); setAutopilotActive(false); }} className="bg-[#c3f400] text-black border-2 border-black px-6 py-2.5 text-xs font-display font-extrabold uppercase">
                        Return to Lobby
                      </button>
                    </div>
                  )}

                </div>

                {/* Real-time Sandbox physics dynamic sliders console */}
                {(!activeGame.isHtmlGame) && (
                  <div className="p-4 border-t border-zinc-900 bg-stone-900/60 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-stone-400 text-xs font-mono font-bold uppercase">
                      <Sliders className="w-3.5 h-3.5 text-[#c3f400]" />
                      <span>PHYSICS SANDBOX MATRIX CONTROLLER</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-900 pt-3">
                      
                      {/* Controller Speed */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-mono text-stone-400 uppercase">
                          <span>obstacle speed</span>
                          <span className="text-white font-bold">{customSpeed}px/frame</span>
                        </div>
                        <input
                          type="range"
                          min="3"
                          max="15"
                          value={customSpeed}
                          onChange={(e) => setCustomSpeed(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Gravity Constant */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-mono text-stone-400 uppercase">
                          <span>gravity constant</span>
                          <span className="text-white font-bold">{customGravity.toFixed(2)}m/s²</span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="1.0"
                          step="0.05"
                          value={customGravity}
                          onChange={(e) => setCustomGravity(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Spawn rate sliding */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-mono text-stone-400 uppercase">
                          <span>spanner intervals</span>
                          <span className="text-white font-bold">{customSpawnFreq} seconds</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="4.0"
                          step="0.2"
                          value={customSpawnFreq}
                          onChange={(e) => setCustomSpawnFreq(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                    </div>

                    {/* Checkboxes parameters */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-900/40 pt-3 font-mono text-[10px] text-stone-500">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
                          <input type="checkbox" checked={customShoot} onChange={(e) => setCustomShoot(e.target.checked)} className="bg-stone-900 accent-[#c3f400] border border-zinc-700" />
                          Blaster Weapons
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
                          <input type="checkbox" checked={customBoss} onChange={(e) => setCustomBoss(e.target.checked)} className="bg-stone-900 accent-[#c3f400] border border-zinc-700" />
                          Epic Cyber Boss
                        </label>
                      </div>

                      <div className="flex gap-3 text-[#c3f400] font-bold">
                        <span>ENTITIES: {entityCount}</span>
                        <span>BEST SCORE: {gameHighScore[activeGame.id] || 0} PTS</span>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Publisher Credits information panels */}
              <div className="border-4 border-black bg-stone-950 p-6 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-zinc-800 bg-stone-900 flex items-center justify-center text-lg font-display uppercase font-bold text-[#c3f400]">
                      {activeGame.creator[0]}
                    </div>
                    <div>
                      <h4 className="font-mono text-sm font-bold text-white uppercase leading-none">by @{activeGame.creator}</h4>
                      <p className="text-[10px] text-stone-500 font-sans mt-1 uppercase">Tokyo Collective Verified Architect</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleFollow(activeGame.creatorId)}
                      className={`font-mono text-xs px-3.5 py-1.5 border ${
                        followingCreators.includes(activeGame.creatorId)
                          ? "bg-zinc-900 border-zinc-700 text-stone-400"
                          : "bg-black border-[#c3f400] text-[#c3f400] hover:bg-[#c3f400] hover:text-black transition-colors"
                      }`}
                    >
                      {followingCreators.includes(activeGame.creatorId) ? "Online" : "+ Follow"}
                    </button>
                    <button className="p-1.5 border border-zinc-800 text-stone-400 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-4 leading-relaxed">
                  <span className="text-[9px] font-mono uppercase font-black tracking-widest text-zinc-500 block mb-1.5">Description Outline</span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">{activeGame.longDescription || activeGame.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 border-t border-zinc-900 pt-3">
                  {activeGame.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono text-[#c3f400] bg-[#c3f400]/10 border border-[#c3f400]/25 px-2.5 py-0.5">
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/50 border border-zinc-800 px-2.5 py-0.5">
                    DIFFICULTY: {activeGame.difficulty || "DYNAMIC AI"}
                  </span>
                </div>
              </div>

              {/* Publisher historic reviews log */}
              <div className="border-4 border-black bg-stone-950 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <h4 className="font-display font-black text-md text-white uppercase tracking-tight flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#c3f400]" />
                    Reviews Matrix
                  </h4>
                  <div className="font-mono text-xs text-stone-500">
                    SENTIMENT: <span className="text-emerald-400 font-bold">{activeGame.rating}% RECOMMEND</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {(GAME_REVIEWS[activeGame.id] || []).map((rev) => (
                    <div key={rev.id} className="border border-zinc-800 bg-zinc-900/20 p-4 font-sans flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img className="w-7 h-7 rounded-none bg-stone-950 border border-zinc-800" src={rev.avatar} alt="" />
                          <div className="leading-tight">
                            <span className="text-xs font-bold text-white block">@{rev.username}</span>
                            <span className="text-[9px] font-mono text-stone-600">committed: {rev.date}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 uppercase border ${rev.isPositive ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400" : "bg-red-950/20 border-red-500/30 text-red-400"}`}>
                          {rev.isPositive ? "Recommended" : "Critical Warning"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed italic pr-4">"{rev.content}"</p>
                      <div className="text-[9px] font-mono text-zinc-600">
                        Total workspace playtime logs: <b>{rev.playtimeHours} hours</b>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Friends roster */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              <div className="border-4 border-black bg-stone-950 p-5 flex flex-col gap-4">
                <h4 className="font-display font-black text-xs uppercase text-[#c3f400] border-b border-zinc-900 pb-2.5 flex justify-between items-center">
                  <span>ACTIVE CO-DEV ROSTER</span>
                  <Users className="w-4 h-4 text-stone-400" />
                </h4>

                <div className="flex flex-col gap-2.5">
                  {friendsList.map(f => (
                    <div 
                      key={f.id}
                      onClick={() => setSelectedFriend(f)}
                      className="border border-zinc-900 bg-zinc-900/40 p-3 flex items-center justify-between cursor-pointer hover:border-[#c3f400] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img className="w-7 h-7 select-none bg-stone-950 border border-zinc-800" src={f.avatar} alt="" />
                        <div>
                          <span className="text-xs font-mono font-bold text-white block">@{f.username}</span>
                          <span className={`text-[8px] font-mono leading-none ${f.status === "Online" || f.status === "In Game" ? "text-emerald-400" : "text-zinc-600"}`}>
                            ● {f.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* -------------------------------------------------------------
          DECIDED VISUAL RETRO POPUP AUTHORIZATION MODAL PRESET
         ------------------------------------------------------------- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md border-4 border-black bg-[#131313] p-6 flex flex-col gap-4 neo-shadow relative">
            
            <button 
              onClick={() => { setShowAuthModal(false); setAuthError(""); }} 
              className="absolute top-4 right-4 font-mono text-xs font-bold text-stone-400 hover:text-white"
            >
              [X] CLOSE
            </button>

            <div className="text-center pb-2 border-b border-zinc-900">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#c3f400] font-black block">SYS_CONNECT_GATEWAY</span>
              <h3 className="font-display font-black text-xl text-white uppercase mt-1 leading-none">
                {myProfile.isSignedIn ? "Customize Identity" : isSignUpMode ? "Create Handle" : "Connect Handle"}
              </h3>
            </div>

            {authError && (
              <div className="bg-red-950/40 border border-red-500/20 p-2.5 font-mono text-[11px] text-red-300">
                {authError}
              </div>
            )}

            <form onSubmit={handleSupabaseAuth} className="flex flex-col gap-3">
              
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono font-bold uppercase text-stone-400">Username handle *</label>
                <input
                  type="text"
                  required
                  value={authHandle}
                  onChange={(e) => setAuthHandle(e.target.value)}
                  placeholder="e.g. SpeedrunnerX"
                  className="bg-stone-900 border border-zinc-700 p-2 text-xs text-white uppercase font-mono placeholder:opacity-20"
                />
              </div>

              {!myProfile.isSignedIn && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono font-bold uppercase text-stone-400">Email Gateway *</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. player@gmail.com"
                      className="bg-stone-900 border border-zinc-700 p-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono font-bold uppercase text-stone-400">Security Password *</label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-stone-900 border border-zinc-700 p-2 text-xs text-white"
                    />
                  </div>
                </>
              )}

              {/* Avatar Seed list selector */}
              <div className="flex flex-col gap-1.5 border-t border-zinc-900 pt-3">
                <label className="text-[9px] font-mono font-bold uppercase text-stone-400">Identity Style Theme</label>
                <div className="grid grid-cols-5 gap-2">
                  {["speedy", "shadow", "neon", "retro", "pixel"].map(seed => (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => setAuthAvatarSeed(seed)}
                      className={`font-mono text-[9px] py-1 border text-center uppercase ${authAvatarSeed === seed ? "bg-[#c3f400] border-black text-black font-extrabold" : "bg-stone-900 border-zinc-800 text-stone-500"}`}
                    >
                      {seed}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-4 bg-[#c3f400] text-black border-2 border-black font-display font-black text-xs uppercase py-3 hover:bg-white active:translate-y-0 duration-200"
              >
                {authLoading ? "Synchronizing Relational Logs..." : myProfile.isSignedIn ? "Save Handle" : isSignUpMode ? "Initialize Create Handler" : "Authorize Session Key"}
              </button>

              {!myProfile.isSignedIn && (
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(!isSignUpMode)}
                  className="text-center font-mono text-[10px] text-[#c4c9ac] hover:underline mt-2"
                >
                  {isSignUpMode ? "Already verified? Login with physical handle credentials" : "New creator? Click to initialize signup schema"}
                </button>
              )}

            </form>

          </div>
        </div>
      )}

      {/* Profile inspection details info trigger window overlay */}
      {selectedFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm border-4 border-black bg-[#131313] p-6 flex flex-col gap-4 neo-shadow relative">
            <button 
              onClick={() => setSelectedFriend(null)} 
              className="absolute top-4 right-4 font-mono text-stone-500 hover:text-white text-xs font-bold"
            >
              [X]
            </button>
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-900">
              <img className="w-12 h-12 bg-stone-950 border border-zinc-700" src={selectedFriend.avatar} alt="" />
              <div>
                <h4 className="font-mono text-sm font-bold text-white leading-none">@{selectedFriend.username}</h4>
                <p className="text-[10px] font-mono text-[#c3f400] mt-1 uppercase">● {selectedFriend.status.toUpperCase()}</p>
              </div>
            </div>
            <div>
              <span className="text-[9px] font-mono text-stone-500 uppercase font-black block mb-1">Developer Bio</span>
              <p className="text-xs text-stone-300 leading-relaxed font-sans italic pr-2">"{selectedFriend.bio}"</p>
            </div>
            <div className="border-t border-zinc-900 pt-3">
              <span className="text-[9px] font-mono text-stone-500 uppercase font-black block mb-1">Active compiler projects</span>
              <span className="text-xs text-white font-mono bg-zinc-900 border border-zinc-800 px-2.5 py-1 block mt-1 uppercase">
                {selectedFriend.isDeveloper ? "Tokyo Voxel Platform Manager" : "Primary Alpha Systems Q&A Tester"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Code Viewer Modal for ZIP File Anatomy auditing */}
      <CodeViewerModal
        isOpen={!!activeCodeViewerFile}
        onClose={() => setActiveCodeViewerFile(null)}
        file={activeCodeViewerFile}
        onPlaytest={() => {
          setZipViewMode("playtest");
          setSelectedGameId("sandbox-studio");
          // @ts-ignore (safely activate play mode if setGameState is declared in local scope)
          if (typeof setGameState === "function") {
            setGameState("playing");
          }
        }}
      />

    </div>
  );
}
