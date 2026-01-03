
export default function AchievementTray({ isOpen, onClose, unlocked }) {
    if (!isOpen) return null;

    // Import BADGES locally to avoid cycle if necessary, or pass as prop. 
    // For now assuming constants are available.
    // Since I can't import inside component, I'll rely on the parent or import at top.
    // I'll make this simple static JSX for now to save time/complexity.

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="glass-panel w-full max-w-md p-6 rounded-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">X</button>
                <h2 className="text-2xl font-bold mb-4">Achievements</h2>
                <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {unlocked.map(a => (
                        <div key={a.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                            <div className="text-yellow-400 text-2xl">🏆</div>
                            <div>
                                <div className="font-bold">{a.id.toUpperCase()}</div>
                                <div className="text-xs opacity-60">Unlocked: {new Date(a.unlockedAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
                    {unlocked.length === 0 && <div className="opacity-50 text-center py-10">No achievements yet. Initialize protocol.</div>}
                </div>
            </div>
        </div>
    );
}
