import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Users, Star, Flame, Terminal, Code2, ArrowRight } from 'lucide-react';
import { Game } from '../types';

interface BentoHeroProps {
  featuredGame: Game;
  onPlay: (gameId: string) => void;
  onOpenStudio: () => void;
}

export const BentoHero: React.FC<BentoHeroProps> = ({
  featuredGame,
  onPlay,
  onOpenStudio,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 md:p-10 border border-white/[0.08] bg-zinc-950/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
      
      {/* Dynamic Background Image with Depth & Dark Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={featuredGame.bannerUrl}
          alt={featuredGame.title}
          className="w-full h-full object-cover object-center opacity-30 scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out mix-blend-luminosity filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 flex flex-col justify-between min-h-[320px] gap-6">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              LIVE ON NEXUS
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300 text-xs font-mono">
              Featured Experience
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              {featuredGame.activePlayers.toLocaleString()} online
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {featuredGame.rating}% satisfaction
            </span>
          </div>
        </div>

        {/* Center Main Text */}
        <div className="max-w-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {featuredGame.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[11px] font-mono text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white">
            <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              {featuredGame.title}
            </span>
          </h1>

          <p className="text-zinc-300 text-sm md:text-base leading-relaxed line-clamp-2 max-w-xl font-sans font-normal">
            {featuredGame.description}
          </p>
        </div>

        {/* Bottom Actions & Quick Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPlay(featuredGame.id)}
              className="group/btn flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-lime-500 hover:from-emerald-300 hover:to-lime-400 text-zinc-950 font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>Launch Now</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenStudio}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-zinc-200 text-sm font-semibold backdrop-blur-md transition-all active:scale-95"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Upload or Compile</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>By <b className="text-zinc-200 font-semibold">@{featuredGame.creator}</b></span>
            <span>•</span>
            <span>{featuredGame.difficulty} tier</span>
          </div>
        </div>

      </div>

    </div>
  );
};
