import React, { useState } from 'react';
import { Player } from '../types';
import { UserPlus, UserMinus, Play } from 'lucide-react';

interface SetupScreenProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onStart: () => void;
}

export function SetupScreen({ players, onAddPlayer, onRemovePlayer, onStart }: SetupScreenProps) {
  const [name, setName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPlayer(name.trim());
      setName('');
    }
  };

  return (
    <div className="pt-24 pb-32 px-4 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-primary-fixed/20 rounded-full mb-6">
          <UserPlus className="text-primary-fixed w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">تجهيز اللعبة</h2>
        <p className="text-on-surface-variant/80">أضف أسماء المغامرين لبدء اللعبة</p>
      </div>

      <form onSubmit={handleAdd} className="glass-card p-6 rounded-xl mb-8 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم اللاعب..."
          className="flex-1 bg-surface-container-highest/40 border-none rounded-lg px-4 py-3 text-white placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-fixed outline-none transition-all"
        />
        <button
          type="submit"
          className="bg-primary-fixed text-on-primary-fixed font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          <span>أضف</span>
        </button>
      </form>

      <div className="space-y-4">
        {players.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
            <p className="text-on-surface-variant/40">لا يوجد لاعبين حتى الآن</p>
          </div>
        ) : (
          players.map((p, index) => (
            <div key={p.id} className="glass-card p-4 rounded-xl flex justify-between items-center group hover:bg-white/5 transition-all neon-border-primary">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-fixed to-secondary-container flex items-center justify-center text-on-primary-fixed font-bold text-lg">
                  {index + 1}
                </div>
                <span className="font-bold text-lg text-primary">{p.name}</span>
              </div>
              <button
                onClick={() => onRemovePlayer(p.id)}
                className="text-error/40 hover:text-error transition-colors p-2"
              >
                <UserMinus className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/90 to-transparent z-40">
        <button
          onClick={onStart}
          disabled={players.length < 2}
          className="w-full max-w-lg mx-auto bg-primary-fixed text-on-primary-fixed font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(189,255,0,0.4)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          <span className="text-xl">ابدأ المغامرة</span>
          <Play className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
}
