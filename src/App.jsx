/**
 * PROJECT: CYBER_RUNNER
 * DEVELOPER: MAUWI MADE
 * VERSION: 1.0.5
 */

import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 12;

export default function App() {
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [walls, setWalls] = useState([]);
  const [floor, setFloor] = useState(1);
  const [goal, setGoal] = useState({ x: 10, y: 10 });
  const [showSignature, setShowSignature] = useState(false);

  // 1. BOOT SEQUENCE SIGNATURE
  useEffect(() => {
    console.clear();
    console.log(
      "%c MAUWI MADE %c SECURE_BOOT_COMPLETED ",
      "background: #06b6d4; color: #fff; font-weight: bold; padding: 5px 10px; border-radius: 5px 0 0 5px;",
      "background: #111827; color: #06b6d4; padding: 5px 10px; border: 1px solid #06b6d4; border-radius: 0 5px 5px 0;"
    );
  }, []);

  const generateMaze = useCallback(() => {
    const newWalls = [];
    const wallCount = 38 + (floor * 2); 
    for (let i = 0; i < wallCount; i++) {
      const wx = Math.floor(Math.random() * GRID_SIZE);
      const wy = Math.floor(Math.random() * GRID_SIZE);
      const isReserved = (wx === 1 && wy === 1) || (wx === 10 && wy === 10) || (wx === player.x && wy === player.y);
      if (!isReserved) newWalls.push(`${wx},${wy}`);
    }
    setWalls(newWalls);
    setPlayer({ x: 1, y: 1 });
  }, [floor]);

  useEffect(() => { generateMaze(); }, [floor, generateMaze]);

  const handleMove = (dx, dy) => {
    setPlayer(prev => {
      const nx = prev.x + dx;
      const ny = prev.y + dy;
      if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) return prev;
      if (walls.includes(`${nx},${ny}`)) return prev;
      if (nx === goal.x && ny === goal.y) {
        setFloor(f => f + 1);
        return { x: 1, y: 1 };
      }
      return { x: nx, y: ny };
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowUp') handleMove(0, -1);
      if (e.key === 'ArrowDown') handleMove(0, 1);
      if (e.key === 'ArrowLeft') handleMove(-1, 0);
      if (e.key === 'ArrowRight') handleMove(1, 0);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [walls]);

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-500 flex flex-col items-center justify-center font-mono p-4 select-none relative overflow-hidden">
      
      {/* 2. BACKGROUND WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <h2 className="text-[15vw] font-black uppercase -rotate-12 whitespace-nowrap">
          MAUWI MADE
        </h2>
      </div>

      {/* 3. INTERACTIVE SIGNATURE OVERLAY */}
      {showSignature && (
        <div className="absolute inset-0 z-50 bg-cyan-500/10 backdrop-blur-md flex items-center justify-center" onClick={() => setShowSignature(false)}>
          <div className="bg-slate-900 border-2 border-cyan-500 p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <h3 className="text-4xl font-black text-white italic mb-2 tracking-tighter">MAUWI MADE</h3>
            <p className="text-cyan-600 text-xs uppercase tracking-[0.3em]">Hardware & Software Architect</p>
            <p className="mt-6 text-[10px] text-slate-500">Tap anywhere to return to terminal</p>
          </div>
        </div>
      )}

      {/* HUD */}
      <div className="mb-6 text-center border-b border-cyan-900 pb-2 w-full max-w-[400px] z-10">
        <h1 className="text-2xl font-black tracking-widest text-white italic">CYBER_RUNNER</h1>
        <div className="flex justify-between mt-2 px-4 text-[10px] font-bold">
          <span className="cursor-pointer hover:text-white" onClick={() => setShowSignature(true)}>FLOOR: 0{floor}</span>
          <span className="text-cyan-800 tracking-widest">DEV: MAUWI</span>
          <span>X: {player.x} Y: {player.y}</span>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-12 gap-1 bg-slate-900 p-2 rounded-lg border-2 border-slate-800 shadow-2xl relative z-10">
        {[...Array(GRID_SIZE)].map((_, y) => (
          [...Array(GRID_SIZE)].map((_, x) => {
            const isPlayer = player.x === x && player.y === y;
            const isGoal = goal.x === x && goal.y === y;
            const isWall = walls.includes(`${x},${y}`);
            const dist = Math.sqrt(Math.pow(player.x - x, 2) + Math.pow(player.y - y, 2));
            const isVisible = dist < 2.8;

            return (
              <div 
                key={`${x}-${y}`} 
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-lg rounded-sm transition-all duration-300
                  ${!isVisible ? 'bg-black' : isWall ? 'bg-slate-800 text-slate-700' : 'bg-slate-900 border border-slate-800/10'}`}
              >
                {isVisible && (
                  isPlayer ? <span className="drop-shadow-[0_0_5px_#22d3ee]">👾</span> : 
                  isGoal ? <span className="animate-bounce text-yellow-400">★</span> : 
                  isWall ? <span className="opacity-10 text-[10px]">01</span> : ''
                )}
              </div>
            );
          })
        ))}
      </div>

      {/* CONTROLS */}
      <div className="mt-10 grid grid-cols-3 gap-3 z-10">
        <div /> 
        <button onClick={() => handleMove(0, -1)} className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center border border-cyan-900 shadow-[0_0_10px_rgba(6,182,212,0.2)] active:scale-90 active:bg-cyan-900 transition-all">▲</button>
        <div />
        <button onClick={() => handleMove(-1, 0)} className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center border border-cyan-900 shadow-[0_0_10px_rgba(6,182,212,0.2)] active:scale-90 active:bg-cyan-900 transition-all">◀</button>
        <button onClick={() => handleMove(0, 1)} className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center border border-cyan-900 shadow-[0_0_10px_rgba(6,182,212,0.2)] active:scale-90 active:bg-cyan-900 transition-all">▼</button>
        <button onClick={() => handleMove(1, 0)} className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center border border-cyan-900 shadow-[0_0_10px_rgba(6,182,212,0.2)] active:scale-90 active:bg-cyan-900 transition-all">▶</button>
      </div>

      <footer className="mt-12 text-[9px] text-slate-700 tracking-[0.4em] uppercase z-10">
        <span className="text-cyan-800 font-bold">Mauwi Made</span>
      </footer>
    </div>
  );
}