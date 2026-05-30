import React, { useState, useEffect } from 'react';
import { Challenge, Category } from '../types';
import { CATEGORIES } from '../data';
import { Trophy, ArrowRight, RefreshCcw, Timer, Play, Pause, RotateCcw } from 'lucide-react';

interface ChallengeScreenProps {
  challenge: Challenge;
  onWin: () => void;
  onLose: () => void;
  onBack: () => void;
}

export function ChallengeScreen({ challenge, onWin, onLose, onBack }: ChallengeScreenProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const category = CATEGORIES.find(c => c.id === challenge.categoryId);

  // Reset answer & timer when challenge changes
  useEffect(() => {
    setShowAnswer(false);
    setTimeLeft(null);
    setIsTimerRunning(false);
  }, [challenge]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) return;
    setIsTimerRunning(!isTimerRunning);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto flex flex-col gap-8">
      <button onClick={onBack} className="text-on-surface-variant hover:text-white flex items-center gap-2 self-start transition-colors">
        <ArrowRight className="w-5 h-5" />
        العودة للخلف
      </button>

      {/* Main Stage (Bento Card) */}
      <div className="MainStage-card p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center gap-8">
        <div className="inline-flex px-4 py-1.5 rounded-full bg-indigo-600 text-white font-bold text-sm tracking-widest shadow-xl">
          {category?.title}
        </div>
        
        <h2 className="text-2xl md:text-4xl font-bold leading-relaxed text-white max-w-2xl">
          {challenge.content}
        </h2>

        {/* Timer Section */}
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-700 p-4 rounded-2xl flex flex-col gap-3 mt-4">
          {timeLeft === null ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Timer className="w-5 h-5" />
                <span className="font-bold text-sm">مؤقت (اختياري)</span>
              </div>
              <div className="flex gap-2" dir="ltr">
                <button onClick={() => startTimer(90)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-bold text-slate-300 transition-colors active:scale-95">90s</button>
                <button onClick={() => startTimer(60)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-bold text-slate-300 transition-colors active:scale-95">60s</button>
                <button onClick={() => startTimer(30)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-bold text-slate-300 transition-colors active:scale-95">30s</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 font-mono text-3xl font-black tracking-wider ${
                timeLeft === 0 ? 'text-rose-500 animate-pulse' : 
                timeLeft <= 10 ? 'text-rose-400' : 'text-amber-400'
              }`}>
                <Timer className={`w-6 h-6 ${timeLeft === 0 ? 'animate-bounce' : ''}`} />
                {formatTime(timeLeft)}
                {timeLeft === 0 && <span className="text-rose-500 text-sm font-bold ml-2">انتهى الوقت!</span>}
              </div>
              <div className="flex gap-2">
                {timeLeft > 0 && (
                  <button onClick={toggleTimer} className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white transition-colors active:scale-95">
                    {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                )}
                <button onClick={() => { setTimeLeft(null); setIsTimerRunning(false); }} className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white transition-colors active:scale-95">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {challenge.answer && (
          <div className="w-full max-w-md flex flex-col gap-4 mt-4">
            <div className={`w-full p-6 rounded-2xl bg-slate-800 border border-slate-700 transition-all duration-300 ${showAnswer ? 'block' : 'hidden'}`}>
              <p className="text-amber-400 font-bold text-2xl">{challenge.answer}</p>
            </div>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-2xl text-slate-300 font-bold transition-all active:scale-95"
            >
              {showAnswer ? 'إخفاء الإجابة' : 'إظهار الإجابة'}
            </button>
          </div>
        )}
      </div>

      {(!challenge.answer || showAnswer) && (
        <div className="grid grid-cols-2 gap-4 mt-4 max-w-2xl mx-auto w-full">
          <button
            onClick={onWin}
            className="h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
          >
            <Trophy className="w-6 h-6" />
            فوز بالجولة
          </button>
          
          <button
            onClick={onLose}
            className="h-16 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 active:scale-95 transition-all"
          >
            <RefreshCcw className="w-6 h-6" />
            حظ أوفر
          </button>
        </div>
      )}
    </div>
  );
}

