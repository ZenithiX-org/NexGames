import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import AdmZip from "adm-zip";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const PORT = 3000;

// Serve unzipped physical ZIP games statically
const unzippedGamesDir = path.join(process.cwd(), "unzipped_games");
if (!fs.existsSync(unzippedGamesDir)) {
  fs.mkdirSync(unzippedGamesDir, { recursive: true });
}

// HTML game backend storage and default simulation template
const defaultPongHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #060212; color: #fff; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow: hidden; margin: 0; padding: 10px; }
    canvas { background: #0c0817; display: block; margin: 15px auto; border: 2px dashed #d946ef; border-radius: 12px; box-shadow: 0 0 20px rgba(217, 70, 239, 0.5); cursor: none; }
    h1 { color: #06b6d4; margin: 5px 0; font-size: 18px; letter-spacing: 2px; text-shadow: 0 0 8px rgba(6,182,212,0.5); }
    .score-board { display: flex; justify-content: space-around; font-size: 12px; font-family: monospace; color: #a78bfa; margin-bottom: 5px; }
  </style>
</head>
<body>
  <h1>⚡ NEON PONG RETRO ⚡</h1>
  <div class="score-board">
    <span>LIVES: ❤️❤️❤️</span>
    <span id="score-text">SCORE: 000</span>
  </div>
  <canvas id="pong" width="580" height="230"></canvas>
  <script>
    const canvas = document.getElementById("pong");
    const ctx = canvas.getContext("2d");
    const scoreText = document.getElementById("score-text");
    
    let ball = { x: 290, y: 100, dx: 4, dy: -4, radius: 8 };
    let paddle = { x: 240, y: 215, w: 110, h: 12 };
    let score = 0;
    let lives = 3;
    let isGameOver = false;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, relativeX - paddle.w/2));
    });

    function draw() {
      if (isGameOver) {
        ctx.fillStyle = "rgba(10, 5, 25, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 24px monospace";
        ctx.textAlign = "center";
        ctx.fillText("CYBER GRID DOWN", canvas.width/2, canvas.height/2 - 20);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px monospace";
        ctx.fillText("SCORE ACHIEVED: " + score, canvas.width/2, canvas.height/2 + 10);
        ctx.fillText("CLICK SCREEN TO RE-BOOT", canvas.width/2, canvas.height/2 + 40);
        return;
      }

      ctx.fillStyle = "#0c0817";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Net decoration
      ctx.strokeStyle = "rgba(167, 139, 250, 0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Paddle
      ctx.fillStyle = "#d946ef";
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.strokeRect(paddle.x, paddle.y, paddle.w, paddle.h);

      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
      ctx.fillStyle = "#06b6d4";
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#06b6d4";
      ctx.closePath();
      ctx.shadowBlur = 0;

      // Physics
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
      }
      
      if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
      }

      if (ball.y + ball.radius >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
        ball.dy = -Math.abs(ball.dy);
        score += 10;
        scoreText.textContent = "SCORE: " + String(score).padStart(3, '0');
        if (Math.abs(ball.dy) < 9) {
          ball.dy *= 1.04;
          ball.dx *= 1.04;
        }
      }

      if (ball.y - ball.radius > canvas.height) {
        lives--;
        if (lives <= 0) {
          isGameOver = true;
        } else {
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 3;
          ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
          ball.dy = -4;
        }
      }

      requestAnimationFrame(draw);
    }

    canvas.addEventListener("click", () => {
      if (isGameOver) {
        isGameOver = false;
        lives = 3;
        score = 0;
        scoreText.textContent = "SCORE: 000";
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 3;
        ball.dx = 4;
        ball.dy = -4;
        draw();
      }
    });

    draw();
  </script>
</body>
</html>`;

interface HtmlGame {
  id: string;
  title: string;
  creator: string;
  creatorId: string;
  tags: string[];
  description: string;
  longDescription?: string;
  bannerUrl: string;
  rating: number;
  activePlayers: number;
  totalPlays: number;
  releaseDate: string;
  isHtmlGame: boolean;
  htmlContent: string;
  htmlUrl?: string;
  isZip?: boolean;
  zipBase64?: string;
}

let htmlGames: HtmlGame[] = [
  {
    id: "html-pong",
    title: "Neon Pong Retro",
    creator: "PixelQueen_X",
    creatorId: "friend-hacker",
    tags: ["HTML5", "Classic", "Retro", "Arcade"],
    description: "Classic neon pong running inside integrated sandboxed iframes. Move mouse to block local balls!",
    longDescription: "A retro-styled arcade Pong game featuring responsive high-contrast neon grids, interactive mouse tracking, and an automated iframe-sandboxed runtime environment. Engineered with pure HTML5 Canvas and JavaScript with zero heavy load modules.",
    bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    rating: 98,
    activePlayers: 42,
    totalPlays: 792,
    releaseDate: "2026-05-25",
    isHtmlGame: true,
    htmlContent: defaultPongHtml
  }
];

const dbFilePath = path.join(process.cwd(), "html_games_db.json");

// Robust self-healing filesystem boot loader
try {
  if (fs.existsSync(dbFilePath)) {
    const fileData = fs.readFileSync(dbFilePath, "utf-8");
    if (fileData.trim()) {
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) {
        // Suppress default html-pong duplication
        const userUploaded = parsed.filter((g: any) => g && g.id !== "html-pong");
        htmlGames = [...htmlGames, ...userUploaded];
        console.info(`[Database Fallback] Successfully synchronized ${userUploaded.length} custom sandbox application profiles from server storage.`);
      }
    }
  }
} catch (err) {
  console.warn("[Database Fallback] Failed reading local html_games_db.json fallback:", err);
}

// Write synced lists back securely to disk
function saveGamesToDisk() {
  try {
    const userOnlyGames = htmlGames.filter(g => g.id !== "html-pong");
    fs.writeFileSync(dbFilePath, JSON.stringify(userOnlyGames, null, 2), "utf-8");
  } catch (err) {
    console.error("[Database Fallback] Failed compiling saved local JSON lists:", err);
  }
}

// Custom solid-route asset router for unzipped physical games to absolutely bypass Vite SPA intercepts
app.all("/games/*", (req, res) => {
  const filePathStr = req.path.replace(/^\/games\//, "");
  const decodedPath = decodeURIComponent(filePathStr);
  
  // Guard against directory traversal attacks
  const safePath = path.normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, '');
  let physicalPath = path.join(unzippedGamesDir, safePath);
  
  const resolvedBase = path.resolve(unzippedGamesDir);
  const resolvedTarget = path.resolve(physicalPath);
  
  if (!resolvedTarget.startsWith(resolvedBase)) {
    return res.status(403).send("Access denied: Directory traversal attack detected.");
  }
  
  // Self-Healing logic for ZIP game assets on-the-fly
  const segments = safePath.split(/[\/\\]/);
  const gameId = segments[0];
  const savedGame = htmlGames.find(g => g.id === gameId);
  
  if (gameId) {
    const gameDir = path.join(unzippedGamesDir, gameId);
    let needsHeal = false;
    
    if (!fs.existsSync(gameDir)) {
      needsHeal = true;
    } else {
      try {
        const files = fs.readdirSync(gameDir);
        if (files.length === 0) {
          needsHeal = true;
        } else if (savedGame && savedGame.htmlUrl) {
          // Extract relative entrypoint e.g. "index.html" from "/games/html-xxx/index.html"
          const entryRelative = savedGame.htmlUrl.replace(/^\/games\/[^/]+\//, "");
          if (entryRelative && !fs.existsSync(path.join(gameDir, entryRelative))) {
            needsHeal = true;
          }
        }
      } catch (err) {
        needsHeal = true;
      }
    }
    
    if (needsHeal && savedGame && (savedGame.isZip || (savedGame.htmlContent && savedGame.htmlContent.includes("const zipAssets = ")))) {
      console.info(`[Self-Healing] Game folder or entrypoint for "${gameId}" was missing or incomplete. Re-extracting files on-the-fly.`);
      let healed = false;
      
      if (!savedGame.isZip || !savedGame.htmlUrl) {
        savedGame.isZip = true;
        savedGame.htmlUrl = `/games/${gameId}/index.html`;
        saveGamesToDisk();
      }
      
      if (savedGame.zipBase64) {
        try {
          const zipBuffer = Buffer.from(savedGame.zipBase64, "base64");
          extractAndDiscoverZip(zipBuffer, gameDir);
          healed = true;
          console.info(`[Self-Healing] Successfully extracted zipBase64 buffer for "${gameId}"`);
        } catch (unzipErr) {
          console.error(`[Self-Healing] Failed extracting zipBase64 memory buffer for "${gameId}":`, unzipErr);
        }
      }
      
      if (!healed && savedGame.htmlContent) {
        healed = extractFilesFromHtmlContent(savedGame.htmlContent, gameDir);
      }
    }
  }
  
  // Support default page resolution for subfolders
  if (fs.existsSync(physicalPath) && fs.statSync(physicalPath).isDirectory()) {
    physicalPath = path.join(physicalPath, "index.html");
  }
  
  if (fs.existsSync(physicalPath) && fs.statSync(physicalPath).isFile()) {
    const ext = path.extname(physicalPath).toLowerCase();
    
    // Inject custom console, error event interception, and absolute URL routing on HTML files
    if (ext === ".html" || ext === ".htm") {
      try {
        let htmlCodeContent = fs.readFileSync(physicalPath, "utf-8");
        
        // Rewrite static absolute URLs to be game-relative
        const gameRootPath = `/games/${gameId}`;
        htmlCodeContent = htmlCodeContent.replace(/(src|href|action)=\s*["']\/([^/][^"']*)["']/g, `$1="${gameRootPath}/$2"`);
        htmlCodeContent = htmlCodeContent.replace(/url\(\s*["']?\/([^/][^"')]*)\s*["']?\)/g, `url('${gameRootPath}/$1')`);

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

    // --- Absolute Path Dynamic Interception ---
    try {
      const gameBase = "/games/${gameId}";
      function resolvePath(url) {
        if (typeof url !== 'string' || !url) return url;
        if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith(gameBase)) {
          return gameBase + url;
        }
        return url;
      }

      // Intercept standard Image src property
      const imgDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
      if (imgDesc && imgDesc.set) {
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
          set: function(val) {
            imgDesc.set.call(this, resolvePath(val));
          },
          get: function() {
            return imgDesc.get.call(this);
          }
        });
      }

      // Intercept HTMLAudioElement src
      const audDesc = Object.getOwnPropertyDescriptor(HTMLAudioElement.prototype, 'src');
      if (audDesc && audDesc.set) {
        Object.defineProperty(HTMLAudioElement.prototype, 'src', {
          set: function(val) {
            audDesc.set.call(this, resolvePath(val));
          },
          get: function() {
            return audDesc.get.call(this);
          }
        });
      }

      // Intercept HTMLVideoElement src
      const vidDesc = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'src');
      if (vidDesc && vidDesc.set) {
        Object.defineProperty(HTMLVideoElement.prototype, 'src', {
          set: function(val) {
            vidDesc.set.call(this, resolvePath(val));
          },
          get: function() {
            return vidDesc.get.call(this);
          }
        });
      }

      // Intercept XML Http Requests open
      const rawXmlOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        return rawXmlOpen.call(this, method, resolvePath(url), ...args);
      };

      // Intercept dynamic Fetch
      const rawFetch = window.fetch;
      window.fetch = function(input, init) {
        if (typeof input === 'string') {
          input = resolvePath(input);
        } else if (input instanceof Request) {
          const urlStr = input.url;
          const origin = window.location.origin;
          if (urlStr.startsWith(origin)) {
            const relPath = urlStr.substring(origin.length);
            if (relPath.startsWith('/') && !relPath.startsWith(gameBase)) {
              const resolvedUrl = origin + gameBase + relPath;
              input = new Request(resolvedUrl, input);
            }
          }
        }
        return rawFetch(input, init);
      };

      // Audio constructor override
      const OriginalAudio = window.Audio;
      window.Audio = function(src) {
        const audObj = new OriginalAudio();
        if (src) {
          audObj.src = resolvePath(src);
        }
        return audObj;
      };
    } catch (_) {}
  })();
</script>
`;
        if (htmlCodeContent.includes("<head>")) {
          htmlCodeContent = htmlCodeContent.replace("<head>", "<head>" + interceptorScript);
        } else if (htmlCodeContent.includes("<html>")) {
          htmlCodeContent = htmlCodeContent.replace("<html>", "<html>" + interceptorScript);
        } else {
          htmlCodeContent = interceptorScript + htmlCodeContent;
        }
        return res.send(htmlCodeContent);
      } catch (readErr) {
        console.error("[Game Router] Error injecting script:", readErr);
      }
    }

    // Rewrite relative URLs in served CSS files
    if (ext === ".css") {
      try {
        let cssCodeContent = fs.readFileSync(physicalPath, "utf-8");
        const gameRootPath = `/games/${gameId}`;
        cssCodeContent = cssCodeContent.replace(/url\(\s*["']?\/([^/][^"')]*)\s*["']?\)/g, `url('${gameRootPath}/$1')`);
        res.setHeader("Content-Type", "text/css");
        return res.send(cssCodeContent);
      } catch (readErr) {
        console.error("[Game Router] Error inline modifying CSS:", readErr);
      }
    }

    // Serve game assets natively with support for Range queries & native MIME lookups
    return res.sendFile(physicalPath, { maxAge: 0 }, (err) => {
      if (err) {
        console.error("[Game Router] Error sending file:", err);
        if (!res.headersSent) {
          res.status(404).send("File not found");
        }
      }
    });
  }
  
  return res.status(404).send("File not found");
});

// Definitions migrated to the top of the file

// Helper to recursively find the shallowest index.html (prefer index.html, fall back to default, main, or select first .html)
function findPlayableEntrypoint(dir: string, baseDir: string = dir): string | null {
  try {
    const files = fs.readdirSync(dir);
    
    // 1. Look for index.html (case-insensitive) in the current directory
    const indexFile = files.find(f => f.toLowerCase() === "index.html");
    if (indexFile) {
      return path.relative(baseDir, path.join(dir, indexFile)).replace(/\\/g, "/");
    }

    // 2. Next look for other common HTML entry files in the current directory
    const commonNames = ["index.htm", "default.html", "main.html", "game.html"];
    for (const common of commonNames) {
      const found = files.find(f => f.toLowerCase() === common);
      if (found) {
        return path.relative(baseDir, path.join(dir, found)).replace(/\\/g, "/");
      }
    }

    // 3. Next, check for any other .html or .htm file in the current directory
    const anyHtmlFile = files.find(f => f.toLowerCase().endsWith(".html") || f.toLowerCase().endsWith(".htm"));
    if (anyHtmlFile) {
      return path.relative(baseDir, path.join(dir, anyHtmlFile)).replace(/\\/g, "/");
    }

    // 4. Recursively check subdirectories for HTML candidates
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        const found = findPlayableEntrypoint(fullPath, baseDir);
        if (found) {
          return found;
        }
      }
    }
  } catch (err) {
    console.error("Error in findPlayableEntrypoint:", err);
  }
  return null;
}

// Extract virtual file assets inlined in the compiled HTML document
function extractFilesFromHtmlContent(htmlContent: string, targetDir: string): boolean {
  try {
    const searchStr = 'const zipAssets = ';
    const startIndex = htmlContent.indexOf(searchStr);
    if (startIndex === -1) {
      return false;
    }
    const endMarker = 'window.__ZIP_ASSETS__';
    const endIndex = htmlContent.indexOf(endMarker, startIndex);
    if (endIndex === -1) {
      return false;
    }
    
    let rawContent = htmlContent.substring(startIndex + searchStr.length, endIndex).trim();
    if (rawContent.endsWith(";")) {
      rawContent = rawContent.slice(0, -1).trim();
    }
    
    const zipAssets = JSON.parse(rawContent);
    
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetDir, { recursive: true });
    
    for (const relPath of Object.keys(zipAssets)) {
      const asset = zipAssets[relPath];
      const fileDest = path.join(targetDir, relPath);
      fs.mkdirSync(path.dirname(fileDest), { recursive: true });
      
      if (asset.dataUrl && asset.dataUrl.includes(";base64,")) {
        const base64Data = asset.dataUrl.split(";base64,")[1];
        const buffer = Buffer.from(base64Data, "base64");
        fs.writeFileSync(fileDest, buffer);
      } else {
        fs.writeFileSync(fileDest, asset.content || "", "utf-8");
      }
    }
    console.info(`[Self-Healing] Successfully extracted virtual files on-the-fly from HTML content for "${path.basename(targetDir)}"`);
    return true;
  } catch (err) {
    console.error("[Self-Healing] Failed to extract from htmlContent of compiled ZIP:", err);
    return false;
  }
}

// Extract the ZIP archive preserving original folders and return the discovered entrypoint
function extractAndDiscoverZip(zipBuffer: Buffer, targetDir: string): string {
  // Ensure target directory exists and is fresh
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir, { recursive: true });

  const zip = new AdmZip(zipBuffer);
  zip.extractAllTo(targetDir, true);

  // Discover entrypoint relative path (e.g. "index.html" or "my-folder/index.html")
  const entrypoint = findPlayableEntrypoint(targetDir);
  if (!entrypoint) {
    // Clean up directory to keep server storage clean
    try {
      fs.rmSync(targetDir, { recursive: true, force: true });
    } catch (_) {}
    throw new Error("Invalid ZIP package: No playable HTML file (such as index.html, main.html, etc.) was found anywhere in the ZIP archive.");
  }

  return entrypoint;
}

interface FileNode {
  type: "file" | "directory";
  name: string;
  path: string;
  size?: number;
  children?: FileNode[];
}

function getDirectoryTree(dir: string, baseDir: string = dir): FileNode {
  const stats = fs.statSync(dir);
  const name = path.basename(dir);
  const relPath = path.relative(baseDir, dir).replace(/\\/g, "/");

  if (stats.isDirectory()) {
    const children = fs.readdirSync(dir).map(child =>
      getDirectoryTree(path.join(dir, child), baseDir)
    );
    // Sort directories first, then files alphabetically
    children.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "directory" ? -1 : 1;
    });
    return {
      type: "directory",
      name,
      path: relPath,
      children
    };
  } else {
    return {
      type: "file",
      name,
      path: relPath,
      size: stats.size
    };
  }
}

// Sandbox playtest upload endpoint (accepts ZIP in base64 format, extracts securely, returns directory structure)
app.post("/api/sandbox/upload", (req, res) => {
  try {
    const { zipBase64, filename } = req.body;
    if (!zipBase64) {
      return res.status(400).json({ error: "Missing zipBase64 payload." });
    }

    const gameId = `sandbox-${Date.now()}`;
    const gameExtractPath = path.join(unzippedGamesDir, gameId);

    const zipBuffer = Buffer.from(zipBase64, "base64");
    
    // Process ZIP: Extract, Verify, and discover candidate entrypoint
    const entrypoint = extractAndDiscoverZip(zipBuffer, gameExtractPath);
    const iframeUrl = `/games/${gameId}/${entrypoint}`;

    // Compute structure trees
    const structure = getDirectoryTree(gameExtractPath);

    console.info(`[Sandbox Upload] Extracted and verified ZIP package for ID ${gameId}.`);

    return res.json({
      success: true,
      gameId,
      entrypoint,
      iframeUrl,
      structure
    });
  } catch (error: any) {
    console.error("Sandbox ZIP extraction error:", error);
    res.status(500).json({ error: error.message || "Failed to parse sandbox ZIP package." });
  }
});

// HTML games list
app.get("/api/html-games", (req, res) => {
  // Return metadata only for list optimizations
  const list = htmlGames.map(({ htmlContent, ...meta }) => ({
    ...meta,
    htmlUrl: `/api/html-games/${meta.id}/embed`,
    physicalHtmlUrl: meta.htmlUrl
  }));
  res.json(list);
});

// HTML game save upload
app.post("/api/html-games", (req, res) => {
  try {
    const { id, title, description, htmlContent, isZip, zipBase64, creator, creatorId, tags, bannerUrl } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is a requested parameter." });
    }

    const newId = id || `html-${Date.now()}`;
    let finalHtmlUrl: string | undefined = undefined;
    let finalHtmlContent = htmlContent || "<!-- ZIP SOURCE -->";

    if (isZip && zipBase64) {
      // Decode and extract ZIP safely under gamesDir using extraction pipeline
      const zipBuffer = Buffer.from(zipBase64, "base64");
      const gameExtractPath = path.join(unzippedGamesDir, newId);
      
      const entrypoint = extractAndDiscoverZip(zipBuffer, gameExtractPath);
      
      finalHtmlUrl = `/games/${newId}/${entrypoint}`;
      
      // Preserve client-compiled single-html bundle if provided and substantial
      if (htmlContent && htmlContent.length > 100 && !htmlContent.includes("PENDING EXTRACT")) {
        finalHtmlContent = htmlContent;
      } else {
        finalHtmlContent = "<!-- ZIP CONTENT EXTRACTED -->";
      }
    } else {
      if (!htmlContent) {
        return res.status(400).json({ error: "HTML Content is requested for standalones." });
      }
    }

    const newGame: HtmlGame = {
      id: newId,
      title: title.substring(0, 30),
      creator: creator || "Anonymous Uploader",
      creatorId: creatorId || "user-temp",
      tags: tags && tags.length > 0 ? tags : ["HTML5", "User Uploaded"],
      description: (description || "Next-generation dynamic HTML game.").substring(0, 100),
      longDescription: description || "Interactive dynamic game uploaded seamlessly via the zip pipeline. Runs in deep-layered security sandboxed context.",
      bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      rating: 100,
      activePlayers: 0,
      totalPlays: 0,
      releaseDate: new Date().toISOString().substring(0, 10),
      isHtmlGame: true,
      htmlContent: finalHtmlContent,
      htmlUrl: finalHtmlUrl,
      isZip: isZip,
      zipBase64: zipBase64
    };

    htmlGames.push(newGame);
    saveGamesToDisk(); // Instantly persist to local schema
    
    res.json({ success: true, game: { ...newGame, htmlUrl: `/api/html-games/${newId}/embed` } });
  } catch (error: any) {
    console.error("ZIP pipeline compilation failure:", error);
    res.status(500).json({ error: error.message || "Failed to process HTML file save." });
  }
});

// DELETE custom HTML game
app.delete("/api/html-games/:id", (req, res) => {
  try {
    const gameId = req.params.id;
    const gameIndex = htmlGames.findIndex(g => g.id === gameId);
    if (gameIndex === -1) {
      return res.status(404).json({ error: "Game not found." });
    }
    
    const game = htmlGames[gameIndex];
    
    // Clean up physical unzipped directory if it was a ZIP game
    if (game.htmlUrl && game.htmlUrl.startsWith("/games/")) {
      const gameRelPath = game.htmlUrl.replace(/^\/games\//, "").split("/")[0];
      const physicalFolder = path.join(unzippedGamesDir, gameRelPath);
      if (fs.existsSync(physicalFolder)) {
        try {
          fs.rmSync(physicalFolder, { recursive: true, force: true });
          console.info(`[Cleanup] Successfully removed physical directory for game deletion: ${physicalFolder}`);
        } catch (cleanupErr) {
          console.warn("[Cleanup] Failed removing clean-up directory folder:", cleanupErr);
        }
      }
    }
    
    // Remove from in-memory array and save update back to disk JSON DB file
    htmlGames.splice(gameIndex, 1);
    saveGamesToDisk();
    
    res.json({ success: true, message: "Game successfully deleted." });
  } catch (err: any) {
    console.error("Error deleting game:", err);
    res.status(500).json({ error: err.message || "Internal server error during game removal." });
  }
});

// HTML game direct iframe renderer (Raw response headers with dynamic self-heal)
app.get("/api/html-games/:id/embed", async (req, res) => {
  let game = htmlGames.find(g => g.id === req.params.id);
  
  // If not found in memory, attempt dynamic self-healing fetch from Supabase
  if (!game) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        console.info(`[Dynamic Self-Heal] Querying Supabase cloud database for missing game: ${req.params.id}`);
        // Remove trailing slashes and clean the URL
        const cleanSupabaseUrl = supabaseUrl.replace(/\/$/, "");
        const targetUrl = `${cleanSupabaseUrl}/rest/v1/uploaded_games?id=eq.${encodeURIComponent(req.params.id)}&select=*`;
        
        const response = await fetch(targetUrl, {
          headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data[0]) {
            const g = data[0];
            const hasZipMarkers = g.html_content && (
              g.html_content.includes("<!-- ZIP CONTENT EXTRACTED -->") || 
              g.html_content.includes("<!-- ZIP SOURCE -->") ||
              g.html_content.includes("const zipAssets = ")
            );
            
            game = {
              id: g.id || req.params.id,
              title: g.title,
              creator: g.creator || "Anonymous Uploader",
              creatorId: g.creator_id || "user-temp",
              tags: g.tags || ["HTML5"],
              description: g.description || "",
              longDescription: g.long_description || g.description || "",
              bannerUrl: g.banner_url || "",
              rating: g.rating || 100,
              activePlayers: g.active_players || 0,
              totalPlays: g.total_plays || 0,
              releaseDate: g.release_date || new Date().toISOString().substring(0, 10),
              isHtmlGame: true,
              htmlContent: g.html_content,
              isZip: hasZipMarkers,
              htmlUrl: hasZipMarkers ? `/games/${g.id}/index.html` : undefined,
              zipBase64: g.zip_base64 || g.zipBase64
            };
            
            htmlGames.push(game);
            saveGamesToDisk();
            console.info(`[Dynamic Self-Heal] Successfully synced game "${game.title}" from Supabase.`);
          }
        }
      } catch (err) {
        console.error(`[Dynamic Self-Heal] Failed to query Supabase dynamically:`, err);
      }
    }
  }

  if (!game) {
    return res.status(404).send("<h2>HTML Game Core Not Found on Server Nodes</h2>");
  }
  
  // Dynamic promotion of compiled-single-HTML games to high-compatibility physical extracted games!
  // If the game has inlined virtual ZIP assets (containing compiled assets), promote it to a physical ZIP game on-the-fly
  // so that it runs perfectly in the browser without being blocked by sandboxed iframe data-URI script security policies!
  if (game.htmlContent && game.htmlContent.includes("const zipAssets = ")) {
    if (!game.isZip || !game.htmlUrl) {
      console.info(`[Embed Promotion] Promoting compiled-HTML game "${game.title}" (${game.id}) to physical static extracted ZIP game on-the-fly.`);
      game.isZip = true;
      game.htmlUrl = `/games/${game.id}/index.html`;
      saveGamesToDisk();
    }
  }

  if (game.htmlUrl) {
    if (game.htmlUrl.startsWith("/games/")) {
      const gameRelPath = game.htmlUrl.replace(/^\/games\//, "");
      const physicalFilePath = path.join(unzippedGamesDir, gameRelPath);
      
      const gameId = req.params.id;
      if (!fs.existsSync(physicalFilePath)) {
        console.info(`[Embed Self-Healing] Re-extracting files for game ${gameId} on-the-fly.`);
        let healed = false;
        
        if (game.zipBase64) {
          try {
            const zipBuffer = Buffer.from(game.zipBase64, "base64");
            const targetDir = path.join(unzippedGamesDir, gameId);
            extractAndDiscoverZip(zipBuffer, targetDir);
            healed = true;
          } catch (unzipErr) {
            console.error(`[Embed Self-Healing] Failed to self-heal extracting game ${gameId}:`, unzipErr);
          }
        }
        
        if (!healed && game.htmlContent) {
          const targetDir = path.join(unzippedGamesDir, gameId);
          healed = extractFilesFromHtmlContent(game.htmlContent, targetDir);
        }
      }
      
      if (fs.existsSync(physicalFilePath)) {
        return res.redirect(game.htmlUrl);
      } else {
        console.info(`[Self-Healing] Physical directory for game "${game.title}" is gone. Executing self-contained single-file HTML bundle directly from DB.`);
      }
    } else {
      return res.redirect(game.htmlUrl);
    }
  }
  
  res.setHeader("Content-Type", "text/html");
  let fileContent = game.htmlContent || "";
  
  if (fileContent && !fileContent.includes("id=\"nexus-console-interceptor\"")) {
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
    if (fileContent.includes("<head>")) {
      fileContent = fileContent.replace("<head>", "<head>" + interceptorScript);
    } else if (fileContent.includes("<html>")) {
      fileContent = fileContent.replace("<html>", "<html>" + interceptorScript);
    } else {
      fileContent = interceptorScript + fileContent;
    }
  }

  res.send(fileContent);
});

// Vite server setup & static assets logic
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexus Hub fullstack server active on http://0.0.0.0:${PORT}`);
  });
};

startServer();
