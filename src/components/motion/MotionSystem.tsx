import React from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';

// ─── Stagger Container ───
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

const containerVariants = (staggerDelay: number, initialDelay: number): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.08,
  initialDelay = 0.1,
}) => (
  <motion.div
    className={className}
    variants={containerVariants(staggerDelay, initialDelay)}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.div>
);

// ─── Stagger Item ───
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className = '' }) => (
  <motion.div className={className} variants={itemVariants}>
    {children}
  </motion.div>
);

// ─── Fade In ───
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 0.6,
}) => {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: 'blur(4px)', ...directionMap[direction] }}
      animate={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ─── Scale In ───
interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

// ─── Page Transition ───
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  viewKey: string;
}

const pageVariants: Variants = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '', viewKey }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={viewKey}
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

// ─── Glow Pulse ───
interface GlowPulseProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const GlowPulse: React.FC<GlowPulseProps> = ({
  children,
  className = '',
  color = 'rgba(16, 185, 129, 0.15)',
}) => (
  <motion.div
    className={`relative ${className}`}
    animate={{
      boxShadow: [
        `0 0 0px ${color}`,
        `0 0 20px ${color}`,
        `0 0 0px ${color}`,
      ],
    }}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

// ─── Metric Reveal ───
interface MetricRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const MetricReveal: React.FC<MetricRevealProps> = ({
  children,
  className = '',
  delay = 0,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.95, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay,
      type: 'spring',
      stiffness: 200,
      damping: 18,
    }}
  >
    {children}
  </motion.div>
);

// ─── Data Pulse (for map markers, etc.) ───
interface DataPulseProps {
  color?: string;
  size?: number;
  className?: string;
}

export const DataPulse: React.FC<DataPulseProps> = ({
  color = '#10b981',
  size = 12,
  className = '',
}) => (
  <motion.div
    className={`relative ${className}`}
    style={{ width: size, height: size }}
  >
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{ backgroundColor: color }}
      animate={{
        scale: [1, 2.5, 1],
        opacity: [0.6, 0, 0.6],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
    />
    <div
      className="absolute inset-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  </motion.div>
);

// ─── Scan Line Effect ───
interface ScanLineProps {
  active?: boolean;
  className?: string;
}

export const ScanLine: React.FC<ScanLineProps> = ({
  active = true,
  className = '',
}) => {
  if (!active) return null;
  return (
    <motion.div
      className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none ${className}`}
      animate={{ top: ['0%', '100%', '0%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      style={{ opacity: 0.6 }}
    />
  );
};

// ─── Progress Bar Animation ───
interface AnimatedBarProps {
  value: number; // 0-100
  className?: string;
  color?: string;
  delay?: number;
}

export const AnimatedBar: React.FC<AnimatedBarProps> = ({
  value,
  className = '',
  color = 'bg-emerald-400',
  delay = 0,
}) => (
  <div className={`w-full h-1.5 rounded-full bg-slate-900 overflow-hidden ${className}`}>
    <motion.div
      className={`h-full rounded-full ${color}`}
      initial={{ width: '0%' }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
    />
  </div>
);
