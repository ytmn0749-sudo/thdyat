import React, { useEffect, useState } from 'react';
import { Challenge } from '../types';
import { CATEGORIES } from '../data';
import { Package, FileText } from 'lucide-react';

interface MysteryBoxOverlayProps {
  challenge: Challenge;
  onComplete: () => void;
}

export function MysteryBoxOverlay({ challenge, onComplete }: MysteryBoxOverlayProps) {
  const [phase, setPhase] = useState<'shaking' | 'opening'>('shaking');
  const category = CATEGORIES.find(c => c.id === challenge.categoryId);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('opening');
    }, 1500); // Shake for 1.5s

    const timer2 = setTimeout(() => {
      onComplete(); // Trigger navigation after animation completes
    }, 3500); // Time to view the paper before transitioning

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 overflow-hidden">
       {phase === 'shaking' && (
         <div className="animate-shake flex flex-col items-center">
           <Package className="w-40 h-40 text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]" />
           <p className="mt-8 text-2xl font-bold text-white tracking-widest animate-pulse">جاري سحب ورقة عشوائية...</p>
         </div>
       )}

       {phase === 'opening' && (
         <div className="relative flex flex-col items-center">
            {/* The paper sliding up */}
            <div className="animate-paper relative z-10 w-72 h-96 bg-slate-100 rounded-lg shadow-2xl p-6 flex flex-col items-center text-center -mt-32 border border-slate-300">
               <div className="w-full flex justify-between items-center border-b-2 border-slate-200 pb-3 mb-6">
                 <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">ورقة تحدي</span>
                 <FileText className="text-slate-400 w-5 h-5"/>
               </div>
               
               <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
                 <div className="w-20 h-20 rounded-full bg-indigo-100 border-4 border-white shadow-inner flex items-center justify-center relative -mt-8">
                   <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-10 animate-ping"></div>
                   <span className="text-4xl">✨</span>
                 </div>
                 
                 <div className="space-y-2">
                   <p className="text-slate-400 text-sm font-bold">الفئة</p>
                   <span className="text-slate-800 font-black text-xl px-4 py-2 bg-slate-200 rounded-xl inline-block w-full">
                     {category?.title}
                   </span>
                 </div>
               </div>
            </div>
            
            {/* The Box Base overlapping the paper to create the illusion of coming out of it */}
            <div className="relative z-20 -mt-16 flex justify-center w-full">
               <Package className="w-48 h-48 text-slate-800 absolute drop-shadow-2xl opacity-90" style={{ bottom: '-10px' }} />
               {/* Glowing effect inside the box */}
               <div className="absolute top-12 w-32 h-10 bg-amber-500/40 blur-xl rounded-full"></div>
            </div>
         </div>
       )}
    </div>
  );
}
