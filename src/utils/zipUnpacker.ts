import JSZip from "jszip";

/**
 * Normalizes relative paths typical in html files.
 * E.g. "./js/main.js" -> "js/main.js"
 */
export function normalizeRelativePath(path: string): string {
  let p = path.trim().replace(/^\.\//, "");
  p = p.replace(/\/{2,}/g, "/");
  return p;
}

/**
 * Strips query parameters and hashes from URLs to resolve to clean paths for ZIP lookup.
 * Resolves path dot segments ('.' and '..') robustly.
 */
export function cleanPath(url: string, baseDir: string = ""): string {
  if (!url) return "";
  
  // Strip query params and hashes first
  let p = url.split("?")[0].split("#")[0];
  
  // Normalize backslashes to forward slashes, trim trailing/leading spaces
  p = p.trim().replace(/\\/g, "/");
  
  // Prepend baseDir if provided and the path is relative
  if (baseDir && !p.startsWith("/") && !p.includes("://") && !p.startsWith("data:") && !p.startsWith("blob:")) {
    p = baseDir.endsWith("/") ? baseDir + p : baseDir + "/" + p;
  }
  
  const parts = p.split("/");
  const resolvedParts: string[] = [];
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed === "" || trimmed === ".") {
      continue;
    }
    if (trimmed === "..") {
      if (resolvedParts.length > 0 && resolvedParts[resolvedParts.length - 1] !== "..") {
        resolvedParts.pop();
      } else {
        // Keep leading '..' only if we cannot resolve it out (i.e. we are at root)
        resolvedParts.push("..");
      }
    } else {
      resolvedParts.push(trimmed);
    }
  }
  
  return resolvedParts.join("/");
}

/**
 * Computes relative path from base folder of index.html to another file's full path.
 */
function getRelativePath(fromDir: string, toPath: string): string {
  if (!fromDir) return toPath;
  if (toPath.startsWith(fromDir)) {
    return toPath.substring(fromDir.length);
  }
  
  const fromParts = fromDir.split("/").filter(Boolean);
  const toParts = toPath.split("/").filter(Boolean);
  
  let commonCount = 0;
  while (
    commonCount < fromParts.length &&
    commonCount < toParts.length &&
    fromParts[commonCount] === toParts[commonCount]
  ) {
    commonCount++;
  }
  
  const upCount = fromParts.length - commonCount;
  const upParts = Array(upCount).fill("..");
  const downParts = toParts.slice(commonCount);
  
  return [...upParts, ...downParts].join("/");
}

interface FileAsset {
  content: string;
  isBinary: boolean;
  mimeType: string;
  dataUrl: string;
}

export interface VirtualFile {
  name: string;
  path: string; // e.g., "js/main.js"
  extension: string; // e.g., ".js"
  mimeType: string;
  isBinary: boolean;
  content: string; // empty if binary
  dataUrl: string; // complete data URI
}

export interface VirtualFileMap {
  files: Record<string, VirtualFile>;
  htmlFiles: VirtualFile[];
  cssFiles: VirtualFile[];
  jsFiles: VirtualFile[];
  otherFiles: VirtualFile[];
  entryPoint: VirtualFile | null;
}

/**
 * Robust utility function using JSZip that extracts a ZIP file into a highly detailed
 * virtual file map, recursively scanning for and grouping .js, .css, .html, and other assets
 * to construct a fully capable, self-contained virtual execution environment.
 */
export async function extractZipToVirtualFileMap(file: File | Blob | ArrayBuffer): Promise<VirtualFileMap> {
  const zip = await JSZip.loadAsync(file);
  const fileMap: Record<string, VirtualFile> = {};
  
  const htmlFiles: VirtualFile[] = [];
  const cssFiles: VirtualFile[] = [];
  const jsFiles: VirtualFile[] = [];
  const otherFiles: VirtualFile[] = [];
  
  const fileKeys = Object.keys(zip.files).filter(key => !zip.files[key].dir);
  
  const mimeMap: Record<string, string> = {
    ".html": "text/html",
    ".htm": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf"
  };

  for (const key of fileKeys) {
    const zipEntry = zip.files[key];
    const normalizedPath = normalizeRelativePath(key);
    const lcKey = key.toLowerCase();
    
    // Determine extension
    const extIdx = lcKey.lastIndexOf(".");
    const ext = extIdx !== -1 ? lcKey.substring(extIdx) : "";
    
    const mimeType = mimeMap[ext] || "application/octet-stream";
    const isBinary = ![".html", ".htm", ".css", ".js", ".mjs", ".json", ".svg", ".txt", ".xml"].includes(ext);
    
    let content = "";
    let dataUrl = "";
    
    if (isBinary) {
      const base64 = await zipEntry.async("base64");
      dataUrl = `data:${mimeType};base64,${base64}`;
    } else {
      content = await zipEntry.async("string");
      const utf8B64 = btoa(unescape(encodeURIComponent(content)));
      dataUrl = `data:${mimeType};base64,${utf8B64}`;
    }
    
    // Extract file name
    const filename = key.substring(key.lastIndexOf("/") + 1);
    
    const virtualFile: VirtualFile = {
      name: filename,
      path: normalizedPath,
      extension: ext,
      mimeType,
      isBinary,
      content,
      dataUrl
    };
    
    fileMap[normalizedPath] = virtualFile;
    
    // Categorize and group
    if (ext === ".html" || ext === ".htm") {
      htmlFiles.push(virtualFile);
    } else if (ext === ".css") {
      cssFiles.push(virtualFile);
    } else if (ext === ".js" || ext === ".mjs") {
      jsFiles.push(virtualFile);
    } else {
      otherFiles.push(virtualFile);
    }
  }
  
  // Locate optimal index html entry point
  let entryPoint: VirtualFile | null = null;
  const indexHtml = htmlFiles.find(f => f.name.toLowerCase() === "index.html");
  if (indexHtml) {
    entryPoint = indexHtml;
  } else if (htmlFiles.length > 0) {
    // Fallback to whichever HTML is closest to root
    entryPoint = htmlFiles.reduce((prev, curr) => {
      const prevSlashCount = (prev.path.match(/\//g) || []).length;
      const currSlashCount = (curr.path.match(/\//g) || []).length;
      return currSlashCount < prevSlashCount ? curr : prev;
    }, htmlFiles[0]);
  }
  
  return {
    files: fileMap,
    htmlFiles,
    cssFiles,
    jsFiles,
    otherFiles,
    entryPoint
  };
}

export async function compileZipToSingleHtml(file: File): Promise<{ title: string; html: string }> {
  const zip = await JSZip.loadAsync(file);
  const fileAssets: Record<string, FileAsset> = {};
  
  let indexFileKey = "";
  const htmlFiles: string[] = [];
  
  const fileKeys = Object.keys(zip.files).filter(key => !zip.files[key].dir);
  
  // First Pass: Load all files to record their content and construct basic dataUrls
  for (const key of fileKeys) {
    const zipEntry = zip.files[key];
    const lcKey = key.toLowerCase();
    
    const extIdx = lcKey.lastIndexOf(".");
    const ext = extIdx !== -1 ? lcKey.substring(extIdx) : "";
    
    const mimeMap: Record<string, string> = {
      ".html": "text/html",
      ".htm": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".ogg": "audio/ogg",
      ".ico": "image/x-icon",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".ttf": "font/ttf"
    };
    
    const mimeType = mimeMap[ext] || "application/octet-stream";
    const isBinary = ![".html", ".htm", ".css", ".js", ".json", ".svg", ".txt"].includes(ext);
    
    if (lcKey.endsWith(".html") || lcKey.endsWith(".htm")) {
      htmlFiles.push(key);
    }
    
    if (isBinary) {
      const base64Content = await zipEntry.async("base64");
      const dataUrl = `data:${mimeType};base64,${base64Content}`;
      fileAssets[key] = {
        content: "",
        isBinary: true,
        mimeType,
        dataUrl
      };
    } else {
      const textContent = await zipEntry.async("string");
      // Use clean robust base64 encoding for utf8 contents
      const utf8B64 = btoa(unescape(encodeURIComponent(textContent)));
      const dataUrl = `data:${mimeType};base64,${utf8B64}`;
      fileAssets[key] = {
        content: textContent,
        isBinary: false,
        mimeType,
        dataUrl
      };
    }
  }
  
  // Find index.html
  const mainIndex = htmlFiles.find(k => k.toLowerCase().endsWith("index.html"));
  if (mainIndex) {
    indexFileKey = mainIndex;
  } else if (htmlFiles.length > 0) {
    indexFileKey = htmlFiles[0];
  } else {
    throw new Error("No index.html or fallback html file found inside the uploaded ZIP hierarchy.");
  }
  
  const indexDir = indexFileKey.includes("/")
    ? indexFileKey.substring(0, indexFileKey.lastIndexOf("/") + 1)
    : "";
  
  // Pivot fileAssets maps to be relative paths relative to indexDir
  const relativeAssets: Record<string, FileAsset> = {};
  for (const absolutePath of Object.keys(fileAssets)) {
    const relPath = normalizeRelativePath(getRelativePath(indexDir, absolutePath));
    relativeAssets[relPath] = fileAssets[absolutePath];
  }
  
  // Helper to resolve CSS relative urls and imports
  const replaceCssUrls = (cssText: string, cssFileRelPath: string): string => {
    // 1. First process manual link imports
    let processed = cssText.replace(/@import\s+['"]([^'"]+)['"]/g, (match, importPath) => {
      const cssDir = cssFileRelPath.includes("/")
        ? cssFileRelPath.substring(0, cssFileRelPath.lastIndexOf("/") + 1)
        : "";
      const absRelPath = cleanPath(cssDir + importPath);
      const targetAsset = relativeAssets[absRelPath];
      if (targetAsset && !targetAsset.isBinary) {
        return targetAsset.content;
      }
      return match;
    });
    
    // 2. Next process URL assets
    processed = processed.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, urlPath) => {
      if (
        urlPath.startsWith("http:") ||
        urlPath.startsWith("https:") ||
        urlPath.startsWith("data:") ||
        urlPath.startsWith("blob:") ||
        urlPath.startsWith("/")
      ) {
        return match;
      }
      
      const cssDir = cssFileRelPath.includes("/")
        ? cssFileRelPath.substring(0, cssFileRelPath.lastIndexOf("/") + 1)
        : "";
      
      const absRelPath = cleanPath(cssDir + urlPath);
      const targetAsset = relativeAssets[absRelPath];
      if (targetAsset) {
        return `url('${targetAsset.dataUrl}')`;
      }
      return match;
    });
    
    return processed;
  };
  
  // Second Pass: Preprocess CSS files within relativeAssets to support nested resources
  for (const relPath of Object.keys(relativeAssets)) {
    if (relPath.endsWith(".css")) {
      const cssAsset = relativeAssets[relPath];
      const preprocessedContent = replaceCssUrls(cssAsset.content, relPath);
      cssAsset.content = preprocessedContent;
      // Re-encode processed CSS
      const utf8B64 = btoa(unescape(encodeURIComponent(preprocessedContent)));
      cssAsset.dataUrl = `data:text/css;base64,${utf8B64}`;
    }
  }

  // Second Pass B: Preprocess JS/MJS modules to resolve full internal imports/exports
  const compiledJsDataUrls: Record<string, string> = {};
  const activeJsCompilations = new Set<string>();

  const compileJsAsset = (relPath: string): string => {
    if (compiledJsDataUrls[relPath]) {
      return compiledJsDataUrls[relPath];
    }
    if (activeJsCompilations.has(relPath)) {
      // Circular reference guard
      return relativeAssets[relPath]?.dataUrl || "";
    }
    activeJsCompilations.add(relPath);

    const asset = relativeAssets[relPath];
    if (!asset || asset.isBinary) {
      activeJsCompilations.delete(relPath);
      return asset ? asset.dataUrl : "";
    }

    let content = asset.content;

    // 1. Resolve relative static imports & exports
    content = content.replace(
      /((?:\b(?:import|export)\b)(?:\s+[\w*\s{},$|]*\s+from\s*|\s*[*{\s][\w*\s{},$|]*\s+from\s*|\s+)['"])([^'"]+)(['"])/g,
      (match, prefix, importPath, suffix) => {
        if (
          importPath.startsWith("http:") ||
          importPath.startsWith("https:") ||
          importPath.startsWith("data:") ||
          importPath.startsWith("blob:") ||
          importPath.startsWith("/")
        ) {
          return match;
        }

        const jsDir = relPath.includes("/")
          ? relPath.substring(0, relPath.lastIndexOf("/") + 1)
          : "";
        const absRelPath = cleanPath(jsDir + importPath);
        const targetAsset = relativeAssets[absRelPath];

        if (targetAsset) {
          const targetDataUrl = compileJsAsset(absRelPath);
          return `${prefix}${targetDataUrl}${suffix}`;
        }
        return match;
      }
    );

    // 2. Resolve relative dynamic imports
    content = content.replace(
      /(import\(\s*['"])([^'"]+)(['"]\s*\))/g,
      (match, prefix, importPath, suffix) => {
        if (
          importPath.startsWith("http:") ||
          importPath.startsWith("https:") ||
          importPath.startsWith("data:") ||
          importPath.startsWith("blob:") ||
          importPath.startsWith("/")
        ) {
          return match;
        }

        const jsDir = relPath.includes("/")
          ? relPath.substring(0, relPath.lastIndexOf("/") + 1)
          : "";
        const absRelPath = cleanPath(jsDir + importPath);
        const targetAsset = relativeAssets[absRelPath];

        if (targetAsset) {
          const targetDataUrl = compileJsAsset(absRelPath);
          return `${prefix}${targetDataUrl}${suffix}`;
        }
        return match;
      }
    );

    asset.content = content;
    const utf8B64 = btoa(unescape(encodeURIComponent(content)));
    const updatedDataUrl = `data:${asset.mimeType};base64,${utf8B64}`;
    asset.dataUrl = updatedDataUrl;

    compiledJsDataUrls[relPath] = updatedDataUrl;
    activeJsCompilations.delete(relPath);
    return updatedDataUrl;
  };

  for (const relPath of Object.keys(relativeAssets)) {
    if (relPath.endsWith(".js") || relPath.endsWith(".mjs")) {
      compileJsAsset(relPath);
    }
  }
  
  const indexAsset = fileAssets[indexFileKey];
  const originalHtml = indexAsset.content;
  
  // Third Pass: Parse DOM and replace ALL static attribute links with their Data URLs!
  const parser = new DOMParser();
  const doc = parser.parseFromString(originalHtml, "text/html");
  
  // A. Replace Link CSS href links
  const links = doc.querySelectorAll("link");
  links.forEach(link => {
    const rel = link.getAttribute("rel");
    const href = link.getAttribute("href");
    if (href) {
      if (rel === "stylesheet" || href.toLowerCase().endsWith(".css")) {
        const normPath = cleanPath(href);
        const styleAsset = relativeAssets[normPath];
        if (styleAsset) {
          link.setAttribute("href", styleAsset.dataUrl);
        }
      } else {
        // e.g. favicon or preload
        const normPath = cleanPath(href);
        const preloadAsset = relativeAssets[normPath];
        if (preloadAsset) {
          link.setAttribute("href", preloadAsset.dataUrl);
        }
      }
    }
  });
  
  // B. Replace Scripts src links
  const scripts = doc.querySelectorAll("script");
  scripts.forEach(script => {
    const src = script.getAttribute("src");
    if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("/")) {
      const normPath = cleanPath(src);
      const scriptAsset = relativeAssets[normPath];
      if (scriptAsset) {
        script.setAttribute("src", scriptAsset.dataUrl);
      }
    }
  });
  
  // C. Inlined images statically
  const images = doc.querySelectorAll("img");
  images.forEach(img => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("/")) {
      const normPath = cleanPath(src);
      const imgAsset = relativeAssets[normPath];
      if (imgAsset) {
        img.setAttribute("src", imgAsset.dataUrl);
      }
    }
  });
  
  // D. Replace urls inside existing style tags in index.html
  const styles = doc.querySelectorAll("style");
  styles.forEach(style => {
    if (style.textContent) {
      style.textContent = replaceCssUrls(style.textContent, "");
    }
  });
  
  // E. Replace urls inside inline element style attributes
  const elementsWithStyles = doc.querySelectorAll("[style]");
  elementsWithStyles.forEach(el => {
    const styleAttr = el.getAttribute("style");
    if (styleAttr) {
      el.setAttribute("style", replaceCssUrls(styleAttr, ""));
    }
  });
  
  // F. Inlined HTML sound/media statically
  const mediaElements = doc.querySelectorAll("audio, video, source");
  mediaElements.forEach(media => {
    const src = media.getAttribute("src");
    if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("/")) {
      const normPath = cleanPath(src);
      const mediaAsset = relativeAssets[normPath];
      if (mediaAsset) {
        media.setAttribute("src", mediaAsset.dataUrl);
      }
    }
  });

  // G. Preprocess relative imports inside inline script tags in index.html as well
  const inlineScripts = doc.querySelectorAll("script:not([src])");
  inlineScripts.forEach(script => {
    if (script.textContent) {
      let content = script.textContent;

      // Replace static relative imports & exports
      content = content.replace(
        /((?:\b(?:import|export)\b)(?:\s+[\w*\s{},$|]*\s+from\s*|\s*[*{\s][\w*\s{},$|]*\s+from\s*|\s+)['"])([^'"]+)(['"])/g,
        (match, prefix, importPath, suffix) => {
          if (
            importPath.startsWith("http:") ||
            importPath.startsWith("https:") ||
            importPath.startsWith("data:") ||
            importPath.startsWith("blob:") ||
            importPath.startsWith("/")
          ) {
            return match;
          }

          const absRelPath = cleanPath(importPath);
          const targetAsset = relativeAssets[absRelPath];
          if (targetAsset) {
            return `${prefix}${targetAsset.dataUrl}${suffix}`;
          }
          return match;
        }
      );

      // Replace dynamic relative imports
      content = content.replace(
        /(import\(\s*['"])([^'"]+)(['"]\s*\))/g,
        (match, prefix, importPath, suffix) => {
          if (
            importPath.startsWith("http:") ||
            importPath.startsWith("https:") ||
            importPath.startsWith("data:") ||
            importPath.startsWith("blob:") ||
            importPath.startsWith("/")
          ) {
            return match;
          }

          const absRelPath = cleanPath(importPath);
          const targetAsset = relativeAssets[absRelPath];
          if (targetAsset) {
            return `${prefix}${targetAsset.dataUrl}${suffix}`;
          }
          return match;
        }
      );

      script.textContent = content;
    }
  });
  
  // Fourth Pass: Inject highly robust virtualization browser interceptors
  const dynamicFSRuntimeScript = doc.createElement("script");
  dynamicFSRuntimeScript.textContent = `
    (function() {
      // Deep client-side zip virtual filesystem
      const zipAssets = ${JSON.stringify(
        Object.keys(relativeAssets).reduce((acc, relPath) => {
          acc[relPath] = {
            dataUrl: relativeAssets[relPath].dataUrl,
            isBinary: relativeAssets[relPath].isBinary,
            mimeType: relativeAssets[relPath].mimeType,
            content: relativeAssets[relPath].isBinary ? "" : relativeAssets[relPath].content
          };
          return acc;
        }, {} as Record<string, any>)
      )};
      
      window.__ZIP_ASSETS__ = zipAssets;
      
      function sanitizeTraversedRelative(parent, target) {
        if (!target) return target;
        
        // Return protocol, data and blob urls as-is
        if (
          target.startsWith("http:") || 
          target.startsWith("https:") || 
          target.startsWith("data:") || 
          target.startsWith("blob:")
        ) {
          return target;
        }
        
        let clean = target;
        const originPrefix = window.location.origin;
        if (clean.startsWith(originPrefix)) {
          clean = clean.substring(originPrefix.length);
        }
        
        // Strip leading slash
        if (clean.startsWith("/")) {
          clean = clean.substring(1);
        }
        
        // Strip query components and hashes
        clean = clean.split("?")[0].split("#")[0];
        
        // Resolve absolute stack
        let stack = parent ? parent.split("/").filter(Boolean) : [];
        if (stack.length > 0 && parent.endsWith("/")) {
          // Keep dir
        } else if (stack.length > 0) {
          stack.pop(); // discard filename
        }
        
        let segments = clean.split("/").filter(Boolean);
        for (let seg of segments) {
          if (seg === ".") continue;
          if (seg === "..") {
            if (stack.length > 0) stack.pop();
          } else {
            stack.push(seg);
          }
        }
        
        // Normalize
        let finalPath = stack.join("/");
        // Clean leading ./ if any
        finalPath = finalPath.replace(/^\\.\\//, "");
        return finalPath;
      }
      
      let relativeBaseFolder = "";
      
      // Override standard tag source and href properties via Prototypes
      function overrideSrcProperty(proto, attr) {
        const desc = Object.getOwnPropertyDescriptor(proto, attr);
        if (desc && desc.set) {
          Object.defineProperty(proto, attr, {
            set: function(val) {
              if (typeof val === "string") {
                const resolved = sanitizeTraversedRelative(relativeBaseFolder, val);
                const asset = zipAssets[resolved];
                if (asset) {
                  desc.set.call(this, asset.dataUrl);
                  return;
                }
              }
              desc.set.call(this, val);
            },
            get: function() {
              return desc.get.call(this);
            }
          });
        }
      }

      overrideSrcProperty(HTMLImageElement.prototype, "src");
      overrideSrcProperty(HTMLAudioElement.prototype, "src");
      overrideSrcProperty(HTMLVideoElement.prototype, "src");
      overrideSrcProperty(HTMLScriptElement.prototype, "src");
      overrideSrcProperty(HTMLSourceElement.prototype, "src");
      overrideSrcProperty(HTMLLinkElement.prototype, "href");
      
      // XML Http Requests override
      const rawXmlOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        const resolved = sanitizeTraversedRelative(relativeBaseFolder, url);
        const asset = zipAssets[resolved];
        if (asset) {
          return rawXmlOpen.call(this, method, asset.dataUrl, ...args);
        }
        return rawXmlOpen.call(this, method, url, ...args);
      };
      
      // Windows Fetch override
      const rawFetch = window.fetch;
      window.fetch = function(input, init) {
        let pathStr = typeof input === "string" ? input : (input instanceof Request ? input.url : "");
        if (pathStr) {
          const resolved = sanitizeTraversedRelative(relativeBaseFolder, pathStr);
          const asset = zipAssets[resolved];
          if (asset) {
            return rawFetch(asset.dataUrl, init);
          }
        }
        return rawFetch(input, init);
      };
      
      // Image constructor override
      const OriginalImage = window.Image;
      window.Image = function(...args) {
        return new OriginalImage(...args);
      };
      
      // Dynamic HTML Audio constructor override
      const OriginalAudio = window.Audio;
      window.Audio = function(src) {
        const audObj = new OriginalAudio();
        if (src) {
          const resolved = sanitizeTraversedRelative(relativeBaseFolder, src);
          const asset = zipAssets[resolved];
          audObj.src = asset ? asset.dataUrl : src;
        }
        return audObj;
      };
    })();
  `;
  
  const targetParent = doc.head || doc.body || doc.documentElement;
  if (targetParent.firstChild) {
    targetParent.insertBefore(dynamicFSRuntimeScript, targetParent.firstChild);
  } else {
    targetParent.appendChild(dynamicFSRuntimeScript);
  }
  
  let parsedTitle = file.name.replace(/\.[^/.]+$/, "");
  const titleTag = doc.querySelector("title");
  if (titleTag && titleTag.textContent) {
    parsedTitle = titleTag.textContent;
  }
  
  return {
    title: parsedTitle,
    html: doc.documentElement.outerHTML
  };
}
