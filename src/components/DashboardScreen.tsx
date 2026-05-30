import React from 'react';
import { Player, Category } from '../types';
import { CATEGORIES } from '../data';
import { Trophy, Smile, Brain, Headphones, Timer, Mic, User, Package } from 'lucide-react';
import clsx from 'clsx';

const Icons: Record<string, React.ElementType> = {
  Masks: Smile,
  Brain: Brain,
  Headphones: Headphones,
  Timer: Timer,
  Mic: Mic,
};

const NEON_BORDERS = [
  'neon-border-magenta',
  'neon-border-teal',
  'neon-border-purple',
  'neon-border-yellow',
  'neon-border-white',
];

interface DashboardScreenProps {
  players: Player[];
  currentPlayerIndex: number;
  onSelectCategory: (categoryId: string) => void;
  onRandomPick: () => void;
  onReset: () => void;
}

export function DashboardScreen({ players, currentPlayerIndex, onSelectCategory, onRandomPick, onReset }: DashboardScreenProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="pt-24 pb-32 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Categories */}
      <div className="lg:col-span-8 order-2 lg:order-1">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">اختر التحدي التالي</h2>
            <p className="text-slate-400 opacity-70">استعد لإظهار مهاراتك!</p>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-sm font-bold hover:bg-rose-500/20 transition-all flex items-center gap-2"
          >
            إعادة اللعبة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Random Box Button */}
          <div 
            onClick={onRandomPick}
            className="md:col-span-2 glass-card rounded-2xl p-6 min-h-[120px] flex items-center justify-between group cursor-pointer border-r-4 border-amber-500 hover:scale-[1.01] transition-all duration-300 bg-gradient-to-l from-amber-500/10 to-transparent"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <Package className="text-amber-500 w-6 h-6" />
                الصندوق العشوائي
              </h3>
              <p className="text-slate-400 text-sm">اسحب ورقة تحدي عشوائية من جميع الفئات</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:rotate-12 transition-transform">
              <span className="text-xl text-slate-900 font-bold">؟</span>
            </div>
          </div>

          {/* Normal Categories */}
          {CATEGORIES.map((cat, i) => {
            const Icon = Icons[cat.icon] || Smile;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={clsx(
                  "glass-card rounded-2xl p-6 min-h-[180px] flex flex-col justify-between group cursor-pointer border-r-4 hover:scale-[1.02] transition-all duration-300",
                  NEON_BORDERS[i % NEON_BORDERS.length],
                  cat.id === 'cat-3' && 'md:col-span-2'
                )}
              >
                <div className="flex justify-between items-start">
                  <Icon className="w-10 h-10 text-white animate-float" />
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-bold">
                    {cat.points} نقطة
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-1">{cat.title}</h3>
                  <p className="text-on-surface-variant text-sm opacity-80">{cat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar: Leaderboard & Current Turn */}
      <aside className="lg:col-span-4 order-1 lg:order-2 space-y-6">
        <div className="glass-card rounded-3xl p-6 h-full border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 border-b border-surface-container pb-4 mb-4">
              <Trophy className="text-primary-fixed" />
              المتسابقون
            </h2>
          </div>
          
          <div className="space-y-4">
            {sortedPlayers.map((p, i) => {
              const challengesWon = p.prizes.length;
              const punishments = p.prizes.filter(pr => pr.type === 'punishment').length;
              return (
              <div key={p.id} className={clsx(
                "p-4 rounded-xl flex flex-col gap-3 transition-colors",
                i === 0 ? "bg-amber-500/10 border border-amber-500/30" : "bg-slate-800/50 border border-slate-700/50"
              )}>
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0",
                    i === 0 ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20" : "bg-slate-700 border border-slate-600 text-white"
                  )}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white tracking-wide">{p.name} {i === 0 && '👑'}</p>
                    <p className="text-xs text-slate-400 font-mono">المرتبة {i + 1}</p>
                  </div>
                </div>
                
                {/* Stats Table */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-700/50 text-center">
                  <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800">
                    <span className="block text-[10px] text-slate-400 mb-1">فوز</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">{challengesWon}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800">
                    <span className="block text-[10px] text-slate-400 mb-1">عقوبات</span>
                    <span className="font-bold text-rose-400 font-mono text-sm">{punishments}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800">
                    <span className="block text-[10px] text-slate-400 mb-1">الرصيد</span>
                    <span className="font-bold text-amber-400 font-mono text-sm">{p.score}</span>
                  </div>
                </div>
              </div>
            )})}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-indigo-400 font-bold mb-0.5">يلعب الآن</p>
              <p className="font-bold text-white tracking-wide">{currentPlayer?.name} (أنت)</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
