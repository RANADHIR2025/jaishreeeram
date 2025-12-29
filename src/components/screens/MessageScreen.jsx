"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import GradientButton from "../GradientButton"
import { ArrowRight, Home, Sparkles, Heart, Infinity } from "lucide-react"

const messageText = `Happy Birthday, my Puchku 💗🧿∞ You are the most beautiful blessing in my life, and you deserve all the happiness, love, and smiles in the world today and always ∞. Your smile, your kindness, and the way you make people feel truly cared for make everything brighter, especially my life. I hope your day is filled with laughter, sweet surprises, and moments that make your heart happy. Mrs. Roy, you're mine and I'm yours—forever ∞🧿💞 May no nazar ever touch your smile and our love 🧿∞. Keep being the amazing person you are. I love you endlessly ∞, my Puchku 💗✨`

// Particle component for the party effect
function Particle({ x, y, color, size, velocityX, velocityY, emoji }) {
    const [opacity, setOpacity] = useState(1)
    const [position, setPosition] = useState({ x, y })
    const [rotation, setRotation] = useState(Math.random() * 360)

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition(prev => ({
                x: prev.x + velocityX,
                y: prev.y + velocityY
            }))
            setRotation(prev => prev + 2)
            setOpacity(prev => prev - 0.03)
        }, 16)

        return () => clearInterval(interval)
    }, [velocityX, velocityY])

    if (emoji) {
        return (
            <motion.div
                className="absolute text-2xl"
                style={{
                    left: position.x,
                    top: position.y,
                    opacity,
                    transform: `rotate(${rotation}deg)`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
            >
                {emoji}
            </motion.div>
        )
    }

    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                left: position.x,
                top: position.y,
                width: size,
                height: size,
                backgroundColor: color,
                opacity,
                boxShadow: `0 0 ${size * 2}px ${color}`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
        />
    )
}

export default function MessageScreen({ onNext, onHome }) {
    const [flipped, setFlipped] = useState(false)
    const [displayedText, setDisplayedText] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTypingComplete, setIsTypingComplete] = useState(false)
    const [particles, setParticles] = useState([])
    const buttonRef = useRef(null)
    const [showLoveEffect, setShowLoveEffect] = useState(false)

    useEffect(() => {
        if (currentIndex < messageText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + messageText[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, 20)

            return () => clearTimeout(timeout)
        } else {
            setIsTypingComplete(true)
        }
    }, [currentIndex])

    // Reset typing when component mounts
    useEffect(() => {
        setDisplayedText("")
        setCurrentIndex(0)
        setIsTypingComplete(false)
    }, [])

    const createParticles = () => {
        if (!buttonRef.current) return
        
        const buttonRect = buttonRef.current.getBoundingClientRect()
        const centerX = buttonRect.left + buttonRect.width / 2
        const centerY = buttonRect.top + buttonRect.height / 2
        
        const newParticles = []
        const particleCount = 120
        const colors = [
            '#FF6BCB', // Pink
            '#FF8BFF', // Light Pink
            '#FFB6FF', // Lighter Pink
            '#FFD700', // Gold
            '#FFA500', // Orange
            '#FF1493', // Deep Pink
            '#FF69B4', // Hot Pink
            '#FFB6C1', // Light Pink
            '#FFC0CB', // Pink
            '#FFE4E1', // Misty Rose
            '#E6E6FA', // Lavender
            '#D8BFD8', // Thistle
        ]
        
        const emojis = ['💗', '🧿', '∞', '💞', '✨', '🌟', '🎉', '🎂', '🥳']
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = 2 + Math.random() * 4
            const velocityX = Math.cos(angle) * speed
            const velocityY = Math.sin(angle) * speed
            
            // 30% chance to be an emoji particle
            const useEmoji = Math.random() > 0.7
            
            newParticles.push({
                id: Date.now() + i,
                x: centerX,
                y: centerY,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 4 + Math.random() * 8,
                velocityX,
                velocityY,
                emoji: useEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : null
            })
        }
        
        // Add special heart particles in a heart shape
        for (let i = 0; i < 20; i++) {
            const t = i / 20 * Math.PI * 2
            const x = 16 * Math.pow(Math.sin(t), 3)
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
            
            newParticles.push({
                id: Date.now() + particleCount + i,
                x: centerX + x * 2,
                y: centerY + y * 2,
                color: '#FF1493',
                size: 6,
                velocityX: x * 0.1,
                velocityY: y * 0.1,
                emoji: '💗'
            })
        }
        
        setParticles(prev => [...prev, ...newParticles])
        
        // Trigger love effect
        setShowLoveEffect(true)
        setTimeout(() => setShowLoveEffect(false), 1000)
        
        // Remove particles after animation
        setTimeout(() => {
            setParticles([])
        }, 1500)
    }

    const handleButtonClick = () => {
        // Create the particle effect
        createParticles()
        
        // Call the onHome function after a short delay
        setTimeout(() => {
            if (onHome) onHome()
        }, 800)
    }

    return (
        <div className="px-4 md:px-6 py-10 text-center relative min-h-screen overflow-hidden">
            {/* Particles Container */}
            {particles.map(particle => (
                <Particle key={particle.id} {...particle} />
            ))}

            {/* Love Effect Overlay */}
            {showLoveEffect && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                        💗
                    </motion.div>
                    <motion.div
                        className="absolute top-1/3 left-1/4 text-6xl"
                        initial={{ scale: 0, y: -100 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        ∞
                    </motion.div>
                    <motion.div
                        className="absolute top-1/4 right-1/4 text-6xl"
                        initial={{ scale: 0, y: -100 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        🧿
                    </motion.div>
                </motion.div>
            )}

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 drop-shadow mb-6 leading-tight"
            >
                For My Puchku 💗
            </motion.h2>

            <div className="mx-auto relative w-full max-w-3xl flex justify-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="h-auto max-w-xl bg-gradient-to-br from-pink-200/80 via-rose-100/80 to-purple-100/80 rounded-2xl shadow-xl border border-pink-200/30 p-6 md:p-8 text-center backdrop-blur-sm"
                >
                    <div className="relative">
                        {/* Decorative elements */}
                        <div className="absolute -top-3 -left-3 text-2xl">💗</div>
                        <div className="absolute -top-3 -right-3 text-2xl">∞</div>
                        <div className="absolute -bottom-3 -left-3 text-2xl">🧿</div>
                        <div className="absolute -bottom-3 -right-3 text-2xl">✨</div>
                        
                        <p className="text-[#301733] text-lg md:text-xl leading-relaxed min-h-[250px] md:min-h-[300px] text-left p-2 font-medium">
                            {displayedText}
                            {!isTypingComplete && (
                                <span className="inline-block w-[2px] h-[1.2em] bg-rose-500 ml-1 animate-pulse align-middle"></span>
                            )}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isTypingComplete && onNext && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {/* <GradientButton onClick={onNext}>
                            Continue
                            <ArrowRight size={20} />
                        </GradientButton> */}
                    </motion.div>
                )}
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: isTypingComplete ? 0.7 : 0 }}
                    className="relative"
                >
                    <button
                        ref={buttonRef}
                        onClick={handleButtonClick}
                        className="px-10 py-5 rounded-full text-white font-semibold text-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 border-2 border-white/30 shadow-2xl transition-all duration-300 ease-out hover:scale-[1.05] active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300/70 flex gap-3 items-center relative overflow-hidden group"
                    >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Sparkle effect */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full"
                                    initial={{ x: -10, y: Math.random() * 100 }}
                                    animate={{ 
                                        x: "110%",
                                        y: Math.random() * 100 
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                        ease: "linear"
                                    }}
                                />
                            ))}
                        </div>
                        
                        {/* Button content */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="text-yellow-300" size={24} />
                        </motion.div>
                        
                        <span className="relative font-bold tracking-wide">
                            ThankYou Puchku !!!!!!
                            {/* Animated underline effect */}
                            <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-gradient-to-r from-yellow-300 to-pink-300 group-hover:w-full transition-all duration-500"></span>
                        </span>
                        
                        <Heart className="text-red-400 animate-pulse" size={24} />
                    </button>
                    
                    {/* Button glow effect */}
                    <div className="absolute -inset-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
                </motion.div>
            </div>

            {!isTypingComplete && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 text-sm text-rose-400 flex items-center justify-center gap-2"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Infinity size={16} />
                    </motion.div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Infinity size={16} />
                    </motion.div>
                </motion.div>
            )}

            {/* Floating emojis in background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                {['💗', '🧿', '∞', '💞', '✨'].map((emoji, index) => (
                    <motion.div
                        key={index}
                        className="absolute text-3xl opacity-10"
                        style={{
                            left: `${10 + index * 20}%`,
                            top: `${20 + index * 15}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 3 + index,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {emoji}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}