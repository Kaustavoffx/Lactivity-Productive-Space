import { X, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#1a1a1a] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 glass-panel">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-white/5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-[var(--text-main)] opacity-90 leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="p-4 bg-black/20 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors text-gray-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-transform active:scale-95",
                            type === 'warning' ? "bg-amber-600 hover:bg-amber-500" : "bg-[var(--accent)] hover:opacity-90"
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
