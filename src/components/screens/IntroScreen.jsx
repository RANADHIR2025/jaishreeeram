"use client"

import GradientButton from "../GradientButton"
import { Gift } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import confetti from "canvas-confetti"

export default function IntroScreen({ onNext }) {
    const audioRef = useRef(null)
    const [isExploding, setIsExploding] = useState(false)

    // Initialize audio when component mounts
    useEffect(() => {
        // Create audio element
        const audio = new Audio('/christina-perri-a-thousand-years-lyrics-48kbps_sLHWceFg.mp3')
        audio.loop = true
        audio.volume = 0.5 // Slightly lower volume for background music
        audioRef.current = audio

        // Set up event listeners
        const handleCanPlay = () => {
            console.log('Audio loaded and ready to play')
        }

        const handleError = (e) => {
            console.error('Audio loading error:', audio.error)
        }

        const handlePlay = () => {
            console.log('Audio started playing')
        }

        audio.addEventListener('canplay', handleCanPlay)
        audio.addEventListener('error', handleError)
        audio.addEventListener('play', handlePlay)

        // Cleanup function
        return () => {
            audio.removeEventListener('canplay', handleCanPlay)
            audio.removeEventListener('error', handleError)
            audio.removeEventListener('play', handlePlay)
        }
    }, [])

    const createParticleExplosion = () => {
        // Create multiple particle explosions
        const particleCount = 150
        const spread = 70
        const origin = { x: 0.5, y: 0.5 }

        // Main explosion
        confetti({
            particleCount,
            spread,
            origin,
            colors: ['#ff6b9d', '#c471ed', '#4cc9f0', '#f72585', '#7209b7', '#3a0ca3', '#4361ee'],
            shapes: ['circle', 'star'],
            scalar: 1.2,
        })

        // Additional smaller explosions
        setTimeout(() => {
            confetti({
                particleCount: particleCount / 2,
                spread: spread * 1.5,
                origin: { x: 0.3, y: 0.5 },
                colors: ['#ff9a00', '#ffd166', '#ef476f'],
                shapes: ['circle'],
                scalar: 0.8,
            })
        }, 100)

        setTimeout(() => {
            confetti({
                particleCount: particleCount / 2,
                spread: spread * 1.5,
                origin: { x: 0.7, y: 0.5 },
                colors: ['#06d6a0', '#118ab2', '#073b4c'],
                shapes: ['circle'],
                scalar: 0.8,
            })
        }, 200)

        // Shooting stars effect
        setTimeout(() => {
            confetti({
                particleCount: 30,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 1 },
                colors: ['#ff6b9d', '#c471ed'],
                shapes: ['star'],
                scalar: 1.5,
            })
        }, 300)

        setTimeout(() => {
            confetti({
                particleCount: 30,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 1 },
                colors: ['#4cc9f0', '#4361ee'],
                shapes: ['star'],
                scalar: 1.5,
            })
        }, 400)

        // Final burst
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 100,
                origin,
                colors: ['#ff6b9d', '#c471ed', '#4cc9f0', '#f72585'],
                shapes: ['circle', 'star'],
                scalar: 1.5,
            })
        }, 500)
    }

    const handleButtonClick = () => {
        // Set exploding state
        setIsExploding(true)
        
        // Create particle explosion
        createParticleExplosion()
        
        // Play audio if available
        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play()
                .then(() => {
                    console.log('Audio playback started on button click')
                })
                .catch(error => {
                    console.error('Failed to play audio on click:', error)
                    // Try muted workaround
                    audioRef.current.muted = true
                    audioRef.current.play().then(() => {
                        audioRef.current.muted = false
                    }).catch(e => {
                        console.error('Workaround also failed:', e)
                    })
                })
        }
        
        // Navigate to next screen after explosion completes
        setTimeout(() => {
            onNext?.()
        }, 1500) // Wait for explosion animation to complete
    }

    // Auto-start audio when component loads
    useEffect(() => {
        const timer = setTimeout(() => {
            if (audioRef.current) {
                const playPromise = audioRef.current.play()
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Audio auto-started successfully')
                        })
                        .catch(error => {
                            console.log('Auto-play was prevented by browser:', error)
                        })
                }
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="relative py-10 md:py-14 text-center">
            {/* Canvas for confetti */}
            <canvas 
                id="confetti-canvas" 
                className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
                style={{ display: isExploding ? 'block' : 'none' }}
            />
            
            <div className="flex flex-col items-center gap-6 relative z-20">
                <img
                    src="/gifs/intro.gif"
                    alt="Cute birthday animation topper"
                    className="w-[140px] md:w-[180px] object-cover"
                />

                <div>
                    <h1 className="text-pretty text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 drop-shadow leading-tight"
                        style={{
                            filter: "drop-shadow(0 0 20px rgba(255,105,180,0.4))",
                        }}>
                        A Cutiepie was born today, 20 years ago!
                    </h1>
                    <p className="mt-4 text-xl text-pink-200">Yes, it's YOU! A little surprise awaits...</p>
                </div>

                <div className="mt-8 relative">
                    {/* Glow effect for button */}
                    <div className={`absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl blur-xl opacity-0 transition-opacity duration-700 ${isExploding ? 'opacity-70 animate-pulse' : ''}`}></div>
                    
                    <GradientButton
                        onClick={handleButtonClick}
                        className={`relative transition-all duration-300 transform ${isExploding ? 'scale-110' : 'hover:scale-105'}`}
                    >
                        <Gift className={`transition-transform duration-300 ${isExploding ? 'rotate-180 scale-125' : ''}`} size={20} />
                        <span className="ml-2">{isExploding ? 'Surprise! 🎉' : 'Start the surprise'}</span>
                    </GradientButton>
                </div>
                
                {/* Hidden audio element */}
                <audio 
                    style={{ display: 'none' }}
                    src="/christina-perri-a-thousand-years-lyrics-48kbps_sLHWceFg.mp3"
                    loop
                    preload="auto"
                />
            </div>
            
            {/* Additional decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-pink-500/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
        </div>
    )
}