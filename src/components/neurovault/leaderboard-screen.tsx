'use client';

import { useGameStore } from '@/lib/game-store';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Crown, TrendingUp, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_LEADERBOARD = [
  { name: 'NeuroNinja', score: 5000, streak: 12, maxStreak: 15 },
  { name: 'BrainStorm99', score: 4650, streak: 10, maxStreak: 13 },
  { name: 'CipherKing', score: 4200, streak: 9, maxStreak: 11 },
  { name: 'LogicLord', score: 3800, streak: 8, maxStreak: 10 },
  { name: 'PuzzleMaster', score: 3500, streak: 7, maxStreak: 9 },
  { name: 'MindBender', score: 3100, streak: 7, maxStreak: 8 },
  { name: 'VaultCracker', score: 2800, streak: 6, maxStreak: 8 },
  { name: 'IQ_Overlord', score: 2500, streak: 5, maxStreak: 7 },
  { name: 'SynapseX', score: 2200, streak: 5, maxStreak: 6 },
  { name: 'ThinkTank', score: 1900, streak: 4, maxStreak: 5 },
  { name: 'BrainWave', score: 1600, streak: 4, maxStreak: 5 },
  { name: 'NeonMind', score: 1350, streak: 3, maxStreak: 4 },
  { name: 'CyberPuzzler', score: 1100, streak: 3, maxStreak: 4 },
  { name: 'IQ_Vault', score: 900, streak: 2, maxStreak: 3 },
  { name: 'MindGlitch', score: 700, streak: 2, maxStreak: 3 },
  { name: 'DarkSolver', score: 550, streak: 1, maxStreak: 2 },
  { name: 'BrainTrap_X', score: 500, streak: 1, maxStreak: 2 },
  { name: 'PixelPuzzler', score: 480, streak: 1, maxStreak: 2 },
  { name: 'QuantumMind', score: 450, streak: 1, maxStreak: 1 },
  { name: 'TheThinker', score: 400, streak: 1, maxStreak: 1 },
];

function getInitials(name: string) {
  return name
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 2)
    .toUpperCase();
}

function getMedalIcon(rank: number) {
  if (rank === 1) return <Crown className="w-4 h-4 text-[#FFD700]" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-[#C0C0C0]" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-[#CD7F32]" />;
  return null;
}

function getMedalColor(rank: number) {
  if (rank === 1) return '#FFD700';
  if (rank === 2) return '#C0C0C0';
  if (rank === 3) return '#CD7F32';
  return undefined;
}

export function LeaderboardScreen() {
  const { playerName, totalScore, streak, maxStreak, setScreen } = useGameStore();

  const playerEntry = { name: playerName || 'You', score: totalScore, streak, maxStreak };
  const allEntries = [...MOCK_LEADERBOARD, playerEntry].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  const playerRank = allEntries.findIndex((e) => e.name === (playerName || 'You')) + 1;
  const top3 = allEntries.slice(0, 3);
  const rankedList = allEntries.slice(3);

  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
  const podiumHeights = ['h-24', 'h-32', 'h-20'];
  const podiumColors = ['bg-[#C0C0C0]/20 border-[#C0C0C0]/40', 'bg-[#FFD700]/20 border-[#FFD700]/40', 'bg-[#CD7F32]/20 border-[#CD7F32]/40'];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => setScreen('home')}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
        <Trophy className="w-6 h-6 text-[#FFD700]" />
        <h1 className="text-xl font-bold tracking-wider text-[#FFD700] neon-text-blue" style={{ textShadow: '0 0 10px #FFD700, 0 0 20px #FFD70066' }}>
          GLOBAL LEADERBOARD
        </h1>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-end justify-center gap-4">
          {podiumOrder.map((entry, i) => {
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const isPlayer = entry.name === (playerName || 'You');
            return (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-4 w-28 transition-all',
                  podiumColors[i],
                  podiumHeights[i],
                  isPlayer && 'neon-glow-purple border-purple-500'
                )}
              >
                {rank === 1 && <Crown className="w-5 h-5 text-[#FFD700] mb-1" />}
                <span className="text-xs text-white/50">#{rank}</span>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2"
                  style={{ borderColor: getMedalColor(rank), backgroundColor: `${getMedalColor(rank)}22` }}
                >
                  {getInitials(entry.name)}
                </div>
                <span className={cn('text-xs font-semibold truncate max-w-full text-center', rank === 1 ? 'text-[#FFD700]' : 'text-white/80')}>
                  {entry.name}
                </span>
                <span className="text-xs text-white/50">{entry.score.toLocaleString()} pts</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Full Rankings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <div className="max-h-96 overflow-y-auto space-y-1 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a855f7 transparent' }}>
          {rankedList.map((entry, i) => {
            const rank = i + 4;
            const isPlayer = entry.name === (playerName || 'You');
            return (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.03 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  i % 2 === 0 ? 'bg-white/[0.03]' : 'bg-transparent',
                  isPlayer && 'bg-purple-500/20 border border-purple-500/40'
                )}
              >
                <span className="w-8 text-center text-sm font-bold" style={{ color: getMedalColor(rank) ?? 'rgba(255,255,255,0.5)' }}>
                  {rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white/70">
                  {getInitials(entry.name)}
                </div>
                <span className={cn('flex-1 text-sm truncate', isPlayer ? 'text-purple-300 font-semibold' : 'text-white/80')}>
                  {entry.name}
                </span>
                <div className="flex items-center gap-1 text-xs text-orange-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{entry.streak}</span>
                </div>
                <span className="text-sm font-mono text-white/60 w-16 text-right">{entry.score.toLocaleString()}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Your Rank */}
      {playerRank > 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card neon-glow-purple p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-xs text-white/50">Your Rank</p>
              <p className="text-lg font-bold text-purple-300">#{playerRank}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-mono text-white/70">{totalScore.toLocaleString()} pts</p>
            <div className="flex items-center gap-1 text-xs text-orange-400">
              <TrendingUp className="w-3 h-3" />
              <span>Streak: {streak}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
