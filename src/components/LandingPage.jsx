import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldAlert, Palette, ChevronRight } from 'lucide-react';

const STEPS = [
    {
        id: 'welcome',
        title: 'LACTIVITY',
        subtitle: '// TEMPORAL ARCHITECTURE',
        icon: null, // Uses the main logo
        description: "Welcome to the next evolution of time tracking. A system designed for high-fidelity productivity monitoring."
    },
    {
        id: 'survival',
        title: 'PROTOCOL: SURVIVAL',
        subtitle: '// RESOURCE SCARCITY',
        icon: ShieldAlert,
        description: "Your past is immutable. You are granted 3 Time Tokens daily to correct historical records. Spend them wisely."
    },
    {
        id: 'atmosphere',
        title: 'VISUALS: ATMOSPHERE',
        subtitle: '// PERSONALIZATION ENGINE',
        icon: Palette,
        description: "Customize your environment. Choose from Singularity, Bio-Hazard, Solaris, or Deep Ocean to match your cognitive state."
    }
];

export default function LandingPage({ onEnter }) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onEnter();
        }
    };

    const stepData = STEPS[currentStep];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] text-white overflow-hidden p-6"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">

                <AnimatePresence mode="wait">
                    <motion.div
                        key={stepData.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-8"
                    >
                        {/* Icon / Graphics */}
                        <div className="h-32 flex items-center justify-center">
                            {stepData.id === 'welcome' ? (
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[var(--accent)] to-blue-600 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.3)] flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-6xl md:text-7xl font-bold text-white tracking-tighter">L</span>
                                </div>
                            ) : (
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                    <stepData.icon className="w-12 h-12 md:w-16 md:h-16 text-[var(--accent)]" />
                                </div>
                            )}
                        </div>

                        {/* Text */}
                        <div className="space-y-4 max-w-lg">
                            <h1 className="text-3xl md:text-5xl font-thin tracking-[0.2em] text-white/90 font-mono">
                                {stepData.title}
                            </h1>
                            <p className="text-sm md:text-base tracking-[0.3em] text-blue-300/60 uppercase">
                                {stepData.subtitle}
                            </p>
                            <p className="text-gray-400 text-lg leading-relaxed pt-4 font-light">
                                {stepData.description}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="mt-16 flex flex-col items-center gap-6 w-full">
                    {/* Progress Indicators */}
                    <div className="flex gap-3">
                        {STEPS.map((step, idx) => (
                            <div
                                key={step.id}
                                className={`h-1 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-white/20'}`}
                            />
                        ))}
                    </div>

                    {/* Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.05, letterSpacing: "0.2em" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-none border border-white/20 hover:border-white/50 transition-all duration-300 w-full md:w-auto min-w-[200px]"
                    >
                        <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <div className="relative flex items-center justify-center gap-3 text-sm md:text-base font-bold tracking-[0.15em] text-white/90">
                            <span>{currentStep === STEPS.length - 1 ? 'INITIALIZE SYSTEM' : 'NEXT SEQUENCE'}</span>
                            {currentStep === STEPS.length - 1 ? (
                                <ArrowRight className="w-4 h-4 text-[var(--accent)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-white opacity-70" />
                            )}
                        </div>
                    </motion.button>

                    {currentStep < STEPS.length - 1 && (
                        <button onClick={onEnter} className="text-xs text-white/30 hover:text-white/60 tracking-widest uppercase transition-colors">
                            Skip Initialization
                        </button>
                    )}
                </div>

            </div>

            {/* Footer / Version */}
            <div className="absolute bottom-6 text-[10px] text-white/20 tracking-widest font-mono">
                V 1.0.0 // SYSTEM READY
            </div>
        </motion.div>
    );
}
