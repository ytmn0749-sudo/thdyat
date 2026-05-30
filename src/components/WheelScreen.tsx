import React, { useState, useRef } from 'react';
import { WheelSegment } from '../types';
import { WHEEL_SEGMENTS } from '../data';
import { X, Play } from 'lucide-react';

interface WheelScreenProps {
  onComplete: (segment: WheelSegment) => void;
  onClose: () => void;
}

export function WheelScreen({ onComplete, onClose }: WheelScreenProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const startSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const extraRounds = 5 + Math.floor(Math.random() * 5); // 5 to 9 rounds
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (extraRounds * 360) + randomAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Calculate which segment we landed on.
      // Wheel spins clockwise. The pointer is at the TOP (0 degrees).
      const numSegments = WHEEL_SEGMENTS.length;
      // We need to normalize the rotation
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      
      // Each segment has angle 360 / 16 = 22.5
      // segment 0 is from 0 to 22.5. 
      // Because we placed them starting from 0, pointer at 0 means we hit segment 0 if no rotation.
      const segmentIndex = Math.floor(normalizedAngle / (360 / numSegments));
      
      onComplete(WHEEL_SEGMENTS[segmentIndex]);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-md">عجلة الجوائز</h2>
        <p className="text-slate-400 text-lg">أدر العجلة لتحديد جائزتك أو عقوبتك!</p>
      </div>

      <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
        {/* Pointer */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-8 text-rose-500 drop-shadow-lg">
          <svg className="w-full h-full fill-current" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}>
            <path d="M12 21l-12-18h24z"></path>
          </svg>
        </div>

        {/* The Wheel */}
        <div 
          ref={wheelRef}
          className="relative w-full h-full rounded-full border-8 border-slate-800 bg-slate-900 overflow-hidden shadow-2xl"
          style={{
             transition: 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)',
             transform: `rotate(${rotation}deg)`
          }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-500/30 z-[1] pointer-events-none" />
          
          {WHEEL_SEGMENTS.map((segment, i) => {
            const angle = 360 / WHEEL_SEGMENTS.length;
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className="absolute w-1/2 h-1/2 left-1/2 top-1/2 origin-top-left"
                style={{
                  transform: `rotate(${i * angle}deg)`,
                  backgroundColor: isEven ? '#1e293b' : '#334155', // slate-800 / slate-700
                  clipPath: 'polygon(0 0, 100% 0, 100% 41.42%, 0 0)', 
                }}
              >
                <div
                  className="absolute"
                  style={{
                    top: '12%',
                    left: '50%',
                    transform: `translateX(-50%) rotate(${angle / 2}deg)`,
                    color: segment.type === 'money' ? '#34d399' : '#f87171', // emerald-400 / rose-400
                    fontWeight: 'bold',
                    fontSize: '11px',
                    textAlign: 'center',
                    width: '100px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {segment.label}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={startSpin}
          disabled={isSpinning}
          className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-amber-500 text-white font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center border-4 border-slate-900 hover:scale-110 active:scale-95 transition-transform disabled:opacity-80"
        >
          أدر
        </button>
      </div>

      <button
        onClick={onClose}
        disabled={isSpinning}
        className="mt-12 text-on-surface-variant flex items-center gap-2 hover:text-primary transition-colors disabled:opacity-50"
      >
        <X className="w-5 h-5" />
        إغلاق
      </button>
    </div>
  );
}
