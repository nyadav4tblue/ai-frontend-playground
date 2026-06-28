/**
 * RomanticBackground
 * 
 * Creates a romantic decorative background with gradients, light effects, and subtle animations
 */

import { motion } from 'framer-motion'

interface RomanticBackgroundProps {
  showLights?: boolean
  showGradients?: boolean
  showOrbs?: boolean
}

export function RomanticBackground({ 
  showLights = true, 
  showGradients = true,
  showOrbs = true
}: RomanticBackgroundProps) {
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Base gradient layers */}
      {showGradients && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-romantic-midnight via-romantic-twilight to-romantic-deep" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-romantic-lavender/30 via-transparent to-transparent" />
        </>
      )}
      
      {/* Animated light orbs */}
      {showOrbs && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-rose-500/10 to-romantic-lavender/5 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-romantic-coral/5 to-rose-600/10 blur-3xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </>
      )}
      
      {/* Romantic light beams */}
      {showLights && (
        <div className="absolute inset-0">
          {/* Soft romantic glow from corners */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-rose-500/5 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-romantic-lavender/5 via-transparent to-transparent" />
          
          {/* Gentle light beams */}
          <motion.div
            className="absolute top-0 left-1/4 w-px h-1/3 bg-gradient-to-b from-transparent via-rose-300/20 to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-0 right-1/3 w-px h-1/4 bg-gradient-to-b from-transparent via-romantic-coral/20 to-transparent"
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
      )}
      
      {/* Subtle romantic pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Romantic border glow effect */}
      <div className="absolute inset-0 border-[12px] border-transparent">
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-rose-500/5 to-transparent rounded-[inherit] animate-glow" />
      </div>
    </div>
  )
}