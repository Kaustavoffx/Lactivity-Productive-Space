import { useState, useEffect } from 'react';
import { Download, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallModal() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setTimeout(() => setIsVisible(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', () => setIsVisible(false));

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-4"
                >
                    <div className="glass-panel p-5 rounded-2xl border border-[var(--accent)]/30 bg-[var(--bg-card)]/90 backdrop-blur-xl shadow-2xl max-w-sm w-full flex flex-col gap-4 relative overflow-hidden">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[var(--accent)]/10 rounded-lg text-[var(--accent)]">
                                    <Download className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Install Protocol</h3>
                                    <p className="text-xs opacity-70">Add Lactivity to your local system.</p>
                                </div>
                            </div>
                            <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors opacity-50 hover:opacity-100">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setIsVisible(false)}
                                className="flex-1 py-2 px-4 rounded-lg border border-[var(--border-color)] hover:bg-white/5 text-sm font-medium transition-colors"
                            >
                                Dismiss
                            </button>
                            <button
                                onClick={handleInstall}
                                className="flex-1 py-2 px-4 rounded-lg bg-[var(--accent)] text-white hover:brightness-110 text-sm font-bold shadow-lg shadow-[var(--accent)]/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Confirm
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
