import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player, ScreenState, Challenge, WheelSegment } from './types';
import { ALL_CHALLENGES } from './data';
import { SetupScreen } from './components/SetupScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ChallengeScreen } from './components/ChallengeScreen';
import { WheelScreen } from './components/WheelScreen';
import { MysteryBoxOverlay } from './components/MysteryBoxOverlay';
import { Medal, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('game_players');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(() => {
    const saved = localStorage.getItem('game_currentPlayerIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [screen, setScreen] = useState<ScreenState>(() => {
    const saved = localStorage.getItem('game_screen');
    return saved ? (saved as ScreenState) : 'setup';
  });

  const [usedChallenges, setUsedChallenges] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('game_usedChallenges');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(() => {
    const saved = localStorage.getItem('game_currentChallenge');
    return saved ? JSON.parse(saved) : null;
  });

  const [showWheelModal, setShowWheelModal] = useState(false);
  const [lastWheelResult, setLastWheelResult] = useState<WheelSegment | null>(null);

  // Mystery Box State
  const [drawingChallenge, setDrawingChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    localStorage.setItem('game_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('game_currentPlayerIndex', currentPlayerIndex.toString());
  }, [currentPlayerIndex]);

  useEffect(() => {
    localStorage.setItem('game_screen', screen);
  }, [screen]);

  useEffect(() => {
    localStorage.setItem('game_usedChallenges', JSON.stringify(Array.from(usedChallenges)));
  }, [usedChallenges]);

  useEffect(() => {
    if (currentChallenge) {
      localStorage.setItem('game_currentChallenge', JSON.stringify(currentChallenge));
    } else {
      localStorage.removeItem('game_currentChallenge');
    }
  }, [currentChallenge]);

  const handleAddPlayer = (name: string) => {
    setPlayers([...players, { id: Date.now().toString(), name, score: 0, balance: 0, prizes: [] }]);
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const startNextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setScreen('dashboard');
  };

  const handleSelectCategory = (categoryId: string) => {
    const available = ALL_CHALLENGES.filter(
      c => c.categoryId === categoryId && !usedChallenges.has(c.id)
    );
    
    if (available.length === 0) {
      alert('لا توجد تحديات إضافية في هذه الفئة!');
      return;
    }

    const randomChallenge = available[Math.floor(Math.random() * available.length)];
    setUsedChallenges(new Set([...usedChallenges, randomChallenge.id]));
    setCurrentChallenge(randomChallenge);
    setScreen('challenge');
  };

  const handleRandomPick = () => {
    const available = ALL_CHALLENGES.filter(c => !usedChallenges.has(c.id));
    
    if (available.length === 0) {
      alert('لقد انتهت جميع التحديات!');
      return;
    }

    const randomChallenge = available[Math.floor(Math.random() * available.length)];
    setUsedChallenges(new Set([...usedChallenges, randomChallenge.id]));
    
    // Trigger animation overlay
    setDrawingChallenge(randomChallenge);
  };

  const handleWin = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 100
    });
    setShowWheelModal(true);
  };

  const handleLose = () => {
    startNextPlayer();
  };

  const handleWheelComplete = (segment: WheelSegment) => {
    setLastWheelResult(segment);
    
    if (segment.type === 'money' && segment.value && segment.value >= 15) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
      
      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: Math.random() - 0.2 + 0.1, y: Math.random() - 0.2 + 0.1 }
        });
      }, 250);
    } else if (segment.type === 'money') {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        zIndex: 100
      });
    }

    // Update player score if it's money
    setPlayers(players.map((p, i) => {
      if (i === currentPlayerIndex) {
        return {
          ...p,
          score: p.score + (segment.value || 0),
          prizes: [...p.prizes, segment]
        };
      }
      return p;
    }));
  };

  const closeWheelResult = () => {
    setShowWheelModal(false);
    setLastWheelResult(null);
    startNextPlayer();
  };

  const onReset = () => {
    if (confirm('هل أنت متأكد من إعادة ضبط اللعبة؟')) {
      setPlayers([]);
      setCurrentPlayerIndex(0);
      setUsedChallenges(new Set());
      setCurrentChallenge(null);
      setScreen('setup');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full z-[40] flex justify-between items-center px-4 md:px-8 h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-xl">🎲</span>
          </div>
          <div>
            <h1 className="font-bold text-lg md:text-xl text-white tracking-tight">
              تحدي الـ 200 ورقة
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full h-full">
        {screen === 'setup' && (
          <SetupScreen 
            players={players} 
            onAddPlayer={handleAddPlayer} 
            onRemovePlayer={handleRemovePlayer} 
            onStart={() => setScreen('dashboard')} 
          />
        )}

        {screen === 'dashboard' && (
          <DashboardScreen 
            players={players} 
            currentPlayerIndex={currentPlayerIndex} 
            onSelectCategory={handleSelectCategory}
            onRandomPick={handleRandomPick}
            onReset={onReset}
          />
        )}

        {screen === 'challenge' && currentChallenge && (
          <ChallengeScreen 
            challenge={currentChallenge} 
            onWin={handleWin} 
            onLose={handleLose}
            onBack={() => setScreen('dashboard')}
          />
        )}
      </main>

      {/* Modals */}
      {drawingChallenge && (
        <MysteryBoxOverlay
          challenge={drawingChallenge}
          onComplete={() => {
            setCurrentChallenge(drawingChallenge);
            setScreen('challenge');
            setDrawingChallenge(null);
          }}
        />
      )}

      {showWheelModal && !lastWheelResult && !drawingChallenge && (
        <WheelScreen 
          onComplete={handleWheelComplete} 
          onClose={closeWheelResult} 
        />
      )}

      {lastWheelResult && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <div className="glass-card p-8 rounded-3xl text-center max-w-sm w-full border-t-4 border-primary-fixed">
            <Medal className="w-16 h-16 text-primary-fixed mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-primary mb-2">النتيجة!</h3>
            <p className="text-xl text-on-surface-variant font-bold mb-8 p-4 bg-white/5 rounded-xl">
              {lastWheelResult.label}
            </p>
            <button 
              onClick={closeWheelResult}
              className="w-full h-14 bg-primary-fixed text-on-primary-fixed font-bold rounded-xl text-lg active:scale-95 transition-transform"
            >
              متابعة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

