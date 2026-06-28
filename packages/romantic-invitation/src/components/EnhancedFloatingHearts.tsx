/**
 * EnhancedFloatingHearts
 * 
 * Advanced version with multiple heart styles, colors, and animations
 * Creates a romantic atmosphere with floating heart shapes
 */

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Heart, Sparkles, Star } from 'lucide-react'

type HeartType = 'sparkle' | 'filled' | 'outline'
type HeartColor = 'rose' | 'pink' | 'coral' | 'lavender' | 'gold'

interface FloatingHeart {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
  type: HeartType
  color: HeartColor
  rotation: number
  sway: number
}

interface EnhancedFloatingHeartsProps {
  count?: number
  intensity?: 'subtle' | 'medium' | 'romantic'
}

const heartColors = {
  rose: '#f43f5e',
  pink: '#ff6b9d',
  coral: '#ff8e53',
  lavender: '#a78bfa',
  gold: '#fbbf24'
}

const getHeartComponent = (type: HeartType, color: string, size: number) => {
  const baseStyle = { color, fontSize: `${size}px` }
  
  switch (type) {
    case 'sparkle':
      return <Sparkles style={baseStyle} />
    case 'filled':
      return <Heart fill={color} stroke={color} size={size} />
    case 'outline':
      return <Heart fill="transparent" stroke={color} size={size} />
  }
}

export function EnhancedFloatingHearts({ 
  count = 20, 
  intensity = 'romantic' 
}: EnhancedFloatingHeartsProps) {
  
  const getIntensityValues = () => {
    switch (intensity) {
      case 'subtle':
        return { opacityRange: [0.05, 0.2], sizeRange: [12, 20], count: Math.floor(count * 0.5) }
      case 'medium':
        return { opacityRange: [0.1, 0.3], sizeRange: [16, 28], count }
      case 'romantic':
        return { opacityRange: [0.15, 0.4], sizeRange: [20, 36], count: Math.floor(count * 1.5) }
    }
  }
  
  const heartTypes: HeartType[] = ['filled', 'outline', 'sparkle']
  const heartColorsList: HeartColor[] = ['rose', 'pink', 'coral', 'lavender', 'gold']

  const hearts = useMemo<FloatingHeart[]>(() => {
    const { opacityRange, sizeRange, count: heartCount } = getIntensityValues()
    return Array.from({ length: heartCount }, (_, i) => {
      const type = heartTypes[Math.floor(Math.random() * heartTypes.length)]
      const color = heartColorsList[Math.floor(Math.random() * heartColorsList.length)]

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 15,
        opacity: Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0],
        type,
        color,
        rotation: Math.random() * 360,
        sway: Math.random() * 50 - 25
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intensity, count])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="absolute select-none"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            opacity: heart.opacity,
          }}
          initial={{
            y: window.innerHeight + 100,
            x: 0,
            rotate: heart.rotation,
          }}
          animate={{
            y: -100,
            x: [0, heart.sway, 0, -heart.sway, 0],
            rotate: heart.rotation + 360,
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="animate-heartbeat">
            {getHeartComponent(heart.type, heartColors[heart.color], heart.size)}
          </div>
        </motion.div>
      ))}
      
      {/* Subtle sparkle effect */}
      {intensity === 'romantic' && (
        <div className="absolute inset-0">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 5,
                repeat: Infinity,
              }}
            >
              <Star size={Math.random() * 8 + 4} className="text-yellow-300" fill="currentColor" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}