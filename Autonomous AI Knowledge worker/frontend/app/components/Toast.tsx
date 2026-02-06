"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    onClose: (id: string) => void;
}

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
};

function Toast({ id, type, message, onClose }: ToastProps) {
    const Icon = icons[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    return (
        <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="glass-card p-4 shadow-xl flex items-center gap-3 min-w-[300px] max-w-md"
        >
            <div className={`${colors[type]} p-2 rounded-full`}>
                <Icon size={20} className="text-white" />
            </div>
            <p className="flex-1 font-medium">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded transition"
            >
                <X size={18} />
            </button>
        </motion.div>
    );
}

// Toast Container (add this to your layout or main component)
export function ToastContainer() {
    const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; message: string }>>([]);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    // Expose addToast globally
    useEffect(() => {
        (window as any).addToast = (type: ToastType, message: string) => {
            const id = Math.random().toString(36).substr(2, 9);
            setToasts((prev) => [...prev, { id, type, message }]);
        };
    }, []);

    return (
        <div className="fixed top-20 right-6 z-[100] space-y-3">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={removeToast} />
                ))}
            </AnimatePresence>
        </div>
    );
}

// Helper function to show toasts
export function showToast(type: ToastType, message: string) {
    if (typeof window !== "undefined" && (window as any).addToast) {
        (window as any).addToast(type, message);
    }
}

export default Toast;
