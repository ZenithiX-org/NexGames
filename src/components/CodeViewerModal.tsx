import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, FileCode, Code, Play, Terminal, ExternalLink, Settings } from "lucide-react";

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    path: string;
    content: string;
    mimeType: string;
    isBinary: boolean;
  } | null;
  onPlaytest?: () => void;
}

/**
 * Custom Regex-based fast tokenizer and syntax highlighting renderer for HTML, JS/TS, and CSS.
 */
function renderHighlightedCode(code: string, path: string, mimeType: string): React.ReactNode {
  if (!code) return <span className="text-zinc-600 italic">/* This file is empty */</span>;

  const ext = path.split(".").pop()?.toLowerCase() || "";
  const isHtml = ext === "html" || ext === "htm" || mimeType.includes("html");
  const isCss = ext === "css" || mimeType.includes("css");
  const isJs = ext === "js" || ext === "mjs" || ext === "ts" || ext === "jsx" || ext === "tsx" || mimeType.includes("javascript") || mimeType.includes("typescript") || mimeType.includes("json");

  if (isHtml) {
    // Elegant regex-split for HTML tags, comments, strings, inline scripts
    const parts = code.split(/(<!--[\s\S]*?-->|<\/?[\w:-]+(?:\s+[\w:-]+(?:=(?:"[^"]*"|'[^']*'|[^\s'">=]+))?)*\s*\/?>)/g);
    return (
      <>
        {parts.map((part, index) => {
          if (!part) return null;
          if (part.startsWith("<!--")) {
            return <span key={index} className="text-zinc-500 italic">{part}</span>;
          }
          if (part.startsWith("<")) {
            // Check tag name vs attributes vs strings
            const tagParts = part.split(/(\s+[\w:-]+=(?:"[^"]*"|'[^']*'|[^\s'">=]+))/g);
            return (
              <span key={index} className="text-[#818cf8]">
                {tagParts.map((tPart, tIdx) => {
                  if (tPart.includes("=")) {
                    const [attr, val] = tPart.split("=");
                    return (
                      <span key={tIdx}>
                        <span className="text-[#a5f3fc]">{attr}</span>=
                        <span className="text-amber-300">{val}</span>
                      </span>
                    );
                  }
                  return <span key={tIdx} className="text-[#38bdf8] font-bold">{tPart}</span>;
                })}
              </span>
            );
          }
          return <span key={index} className="text-zinc-300">{part}</span>;
        })}
      </>
    );
  }

  if (isCss) {
    // Classes/IDs, braces, rules, properties, and values
    const parts = code.split(/({|}|:|;|\/\*[\s\S]*?\*\/)/g);
    return (
      <>
        {parts.map((part, index) => {
          if (!part) return null;
          if (part.startsWith("/*")) {
            return <span key={index} className="text-zinc-500 italic">{part}</span>;
          }
          if (part === "{" || part === "}" || part === ":" || part === ";") {
            return <span key={index} className="text-[#ff5ec1] font-bold">{part}</span>;
          }
          // Highlight selectors and properties
          if (index % 2 === 0) {
            return <span key={index} className="text-[#cbd5e1]">{part}</span>;
          }
          return <span key={index} className="text-[#c3f400]">{part}</span>;
        })}
      </>
    );
  }

  if (isJs) {
    const keywords = [
      "const", "let", "var", "function", "return", "class", "import", "export",
      "from", "if", "else", "for", "while", "async", "await", "default", "extends",
      "new", "this", "true", "false", "null", "undefined", "try", "catch", "throw",
      "switch", "case", "break", "continue"
    ];
    // Tokenize strings, comments, numbers, keywords
    const regex = /(\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\d+|[a-zA-Z_]\w*|[{}()\[\];.,:+\-*\/=<>!&|?^%~]+|\s+)/g;
    const tokens = code.match(regex) || [code];

    return (
      <>
        {tokens.map((token, index) => {
          if (token.startsWith("//") || token.startsWith("/*")) {
            return <span key={index} className="text-zinc-500 italic">{token}</span>;
          }
          if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
            return <span key={index} className="text-amber-300">{token}</span>;
          }
          if (/^\d+$/.test(token)) {
            return <span key={index} className="text-[#ff571a]">{token}</span>;
          }
          if (keywords.includes(token)) {
            return <span key={index} className="text-[#c3f400] font-black">{token}</span>;
          }
          if (/^[A-Z]\w*$/.test(token)) {
            return <span key={index} className="text-emerald-400 font-bold">{token}</span>;
          }
          if (/^[a-zA-Z_]\w*$/.test(token)) {
            return <span key={index} className="text-[#38bdf8]">{token}</span>;
          }
          return <span key={index} className="text-zinc-400">{token}</span>;
        })}
      </>
    );
  }

  return <span className="text-zinc-300">{code}</span>;
}

export default function CodeViewerModal({ isOpen, onClose, file, onPlaytest }: CodeViewerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !file) return null;

  const code = file.content || "";
  const lines = code.split("\n");
  const charCount = code.length;
  const lineCount = lines.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "html":
      case "htm":
        return <Code className="w-5 h-5 text-[#c3f400]" />;
      case "js":
      case "mjs":
      case "jsx":
      case "ts":
      case "tsx":
        return <FileCode className="w-5 h-5 text-sky-400" />;
      case "css":
        return <FileCode className="w-5 h-5 text-[#ff5ec1]" />;
      default:
        return <FileCode className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl h-[80vh] border-4 border-zinc-800 bg-[#0c0c0c] flex flex-col relative neo-shadow"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-zinc-900 bg-stone-950 p-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 border border-zinc-800">
                {getFileIcon(file.name)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#c3f400] font-black">ZIP_CODE_INSPECT</span>
                  <span className="text-[10px] font-mono text-zinc-600 bg-zinc-950 px-1 border border-zinc-900 rounded-sm">VIRTUAL_FS</span>
                </div>
                <h3 className="font-display font-black text-lg text-white uppercase mt-0.5 tracking-tight flex items-center gap-2">
                  {file.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="bg-stone-900 hover:bg-zinc-900 border border-zinc-800 text-stone-300 font-mono text-[10px] px-3 py-1.5 flex items-center gap-1.5 transition-all uppercase"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>

              {onPlaytest && (
                <button
                  type="button"
                  onClick={() => {
                    onPlaytest();
                    onClose();
                  }}
                  className="bg-[#c3f400] hover:bg-[#b0dc00] text-black font-mono text-[10px] px-3 py-1.5 flex items-center gap-1.5 transition-all uppercase font-black"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  Playtest Game
                </button>
              )}

              <button
                onClick={onClose}
                className="bg-stone-950 hover:bg-zinc-900 border border-zinc-850 text-stone-400 hover:text-white font-mono text-[10px] px-2.5 py-1.5 transition-all"
              >
                [X]
              </button>
            </div>
          </div>

          {/* Subtitle / Path bar */}
          <div className="bg-stone-900/30 px-4 py-1.5 border-b border-zinc-950 flex items-center justify-between shrink-0 font-mono text-[10px] text-zinc-500">
            <span className="truncate">PATH: <span className="text-zinc-300">{file.path}</span></span>
            <span className="shrink-0 ml-4 font-bold text-[#c3f400]">{file.mimeType}</span>
          </div>

          {/* Editor Body */}
          <div className="flex-1 overflow-auto bg-stone-950/20 p-2 font-mono text-xs leading-relaxed custom-scrollbar flex">
            {file.isBinary ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500 gap-3">
                <Terminal className="w-12 h-12 text-[#ff571a] opacity-40 animate-pulse" />
                <span className="font-mono text-xs text-stone-300">Binary format detected. Structural direct code modification and styling evaluation is not supported.</span>
                <span className="text-[10px] bg-zinc-950 px-2.5 py-1 border border-zinc-900 text-stone-500 font-bold uppercase">
                  MIME: {file.mimeType}
                </span>
              </div>
            ) : (
              <div className="w-full flex">
                {/* Line Numbers Column */}
                <div className="text-right pr-4 pl-2 text-zinc-600 border-r border-zinc-900 select-none font-mono text-[11px] min-w-[3.5rem] leading-6 py-2 bg-stone-950/45">
                  {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Highlighted Code Content */}
                <div className="flex-1 pl-4 pr-2 overflow-x-auto py-2 leading-6 font-mono text-[11px] whitespace-pre select-text h-full">
                  {lines.map((line, idx) => (
                    <div key={idx} className="hover:bg-zinc-900/40 w-max min-w-full px-1">
                      {renderHighlightedCode(line || " ", file.path, file.mimeType)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="bg-stone-950 border-t-2 border-zinc-900 p-2.5 px-4 shrink-0 font-mono text-[10px] text-zinc-500 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>LINES: <span className="text-white font-bold">{lineCount}</span></span>
              <span>CHARS: <span className="text-white font-bold">{charCount}</span></span>
              <span>DUR_RENDER: <span className="text-emerald-400">0.02ms</span></span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-[#c3f400] rounded-full animate-ping"></span>
              <span className="text-zinc-400">AUDIT_ACTIVE</span>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
