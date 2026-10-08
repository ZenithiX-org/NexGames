import React from 'react';
import { motion } from 'motion/react';
import { Play, Heart, Star, Users, Flame, ExternalLink, Code2 } from 'lucide-react';
import { Game } from '../types';

interface ModernGameCardProps {
  game: Game;
  onPlay: (gameId: string) => void;
  isLiked: boolean;
  onToggleLike: (gameId: string) => void;
}

export const ModernGameCard: React.FC<ModernGameCardProps> = ({
  game,
  onPlay,
  isLiked,
  onToggleLike,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-zinc-950/60 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7),0_0_30px_-5px_rgba(16,185,129,0.15)]"
    >
      {/* Top Banner & Artwork */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900/80">
        <img
          src={game.bannerUrl}
          alt={game.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent pointer-events-none" />

        {/* Floating Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {game.isHtmlGame ? (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-semibold backdrop-blur-md">
                HTML5
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-semibold backdrop-blur-md">
                Core Engine
              </span>
            )}
            {game.activePlayers > 1000 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[10px] font-mono font-semibold backdrop-blur-md">
                <Flame className="w-2.5 h-2.5 fill-orange-400" />
                Hot
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(game.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md border transition-all pointer-events-auto ${
              isLiked 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
                : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title={isLiked ? 'Favorited' : 'Add to Favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Hover Quick-Play Button Overlay */}
        <div 
          onClick={() => onPlay(game.id)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-950/40 backdrop-blur-[2px] cursor-pointer"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.5)] transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Play Experience</span>
          </div>
        </div>
      </div>

      {/* Card Content Information */}
      <div className="flex flex-1 flex-col justify-between p-4 gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 
              onClick={() => onPlay(game.id)}
              className="font-display font-bold text-base text-white hover:text-emerald-400 cursor-pointer transition-colors truncate"
            >
              {game.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{game.rating}%</span>
            </div>
          </div>

          <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed font-sans">
            {game.description}
          </p>
        </div>

        {/* Tags, Creator & Launch Action */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-white/[0.06]">
          <div className="flex flex-wrap gap-1">
            {game.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="truncate max-w-[120px]">
              by <span className="text-zinc-300 font-semibold">@{game.creator}</span>
            </span>

            <button
              onClick={() => onPlay(game.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-emerald-500 hover:text-zinc-950 text-zinc-200 text-xs font-semibold border border-white/[0.08] hover:border-emerald-500 transition-all active:scale-95"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Launch</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
