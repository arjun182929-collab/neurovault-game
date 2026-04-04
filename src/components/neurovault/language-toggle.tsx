'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, type AppLanguage } from '@/lib/game-store';
import { cn } from '@/lib/utils';

interface LangOption {
  code: AppLanguage;
  label: string;
  flag: string;
}

const LANGUAGES: LangOption[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'hi', label: 'हिं', flag: '🇮🇳' },
];

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const language = useGameStore((s) => s.language);
  const setLanguage = useGameStore((s) => s.setLanguage);

  const activeIndex = LANGUAGES.findIndex((l) => l.code === language);
  const activeLang = LANGUAGES[activeIndex];
  const isHi = language === 'hi';

  const toggleLanguage = () => {
    const nextLang: AppLanguage = isHi ? 'en' : 'hi';
    setLanguage(nextLang);
  };

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleLanguage}
        className={cn(
          'relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-pointer',
          'glass-card border border-neon-purple/30',
          'hover:border-neon-purple/60 transition-all duration-300',
          'neon-glow-purple',
        )}
        aria-label={`Switch language to ${isHi ? 'English' : 'Hindi'}`}
      >
        <motion.span
          key={activeLang.flag}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="text-sm"
        >
          {activeLang.flag}
        </motion.span>
        <motion.span
          key={activeLang.label}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-[10px] font-bold text-white tracking-widest uppercase"
        >
          {activeLang.label}
        </motion.span>
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Main toggle button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={toggleLanguage}
        className={cn(
          'relative flex items-center rounded-full p-1 cursor-pointer',
          'glass-card border border-neon-purple/40',
          'hover:border-neon-purple/70 transition-all duration-300',
        )}
        aria-label={`Switch language to ${isHi ? 'English' : 'Hindi'}`}
      >
        {/* Neon glow background */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className={cn(
            'absolute top-1 bottom-1 rounded-full',
            isHi
              ? 'left-[calc(100%-50%-4px)] bg-neon-purple/20'
              : 'left-1 bg-neon-purple/20',
            'w-[calc(50%-4px)]',
          )}
          style={{
            boxShadow: '0 0 12px rgba(176, 38, 255, 0.4), inset 0 0 8px rgba(176, 38, 255, 0.15)',
          }}
        />

        {LANGUAGES.map((lang, i) => {
          const isActive = lang.code === language;
          return (
            <motion.div
              key={lang.code}
              className={cn(
                'relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors duration-300',
                isActive ? 'text-white' : 'text-gray-500',
              )}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${lang.code}-flag`}
                  initial={{ scale: 0, rotate: isActive ? -90 : 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: isActive ? 90 : -90 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="text-sm leading-none"
                >
                  {lang.flag}
                </motion.span>
              </AnimatePresence>
              <span className={cn(
                'text-xs font-bold tracking-wider uppercase',
                isActive ? 'neon-text-purple' : '',
              )}>
                {lang.label}
              </span>
            </motion.div>
          );
        })}
      </motion.button>

      {/* Trending badge */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex items-center gap-1"
      >
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs"
        >
          🔥
        </motion.span>
        <span className="text-[9px] font-bold text-neon-orange tracking-widest uppercase">
          Trending
        </span>
      </motion.div>
    </div>
  );
}
