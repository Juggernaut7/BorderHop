import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();

  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  const gradients = [
    {
      from: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
      to: 'transparent',
      position: '20% 80%',
    },
    {
      from: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
      to: 'transparent',
      position: '80% 20%',
    },
    {
      from: theme === 'dark' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.05)',
      to: 'transparent',
      position: '50% 50%',
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient orbs */}
      {gradients.map((gradient, index) => (
        <motion.div
          key={index}
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            background: `radial-gradient(circle at ${gradient.position}, ${gradient.from}, ${gradient.to})`,
            left: `${20 + index * 30}%`,
            top: `${20 + index * 20}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 2,
          }}
        />
      ))}

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary-400/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--color-primary), 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--color-primary), 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Animated lines */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" />
        <div className="absolute top-3/4 right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-secondary-400/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 w-24 h-px bg-gradient-to-r from-transparent via-accent-400/30 to-transparent transform -rotate-45" />
      </motion.div>

      {/* Pulse rings */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-64 h-64 border border-primary-400/10 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-48 h-48 border border-secondary-400/10 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default AnimatedBackground; 