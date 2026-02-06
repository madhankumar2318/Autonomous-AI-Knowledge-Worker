"use client";
import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
}

export function SkeletonCard() {
    return (
        <div className="glass-card p-4 space-y-3">
            <div className="skeleton h-6 w-3/4 rounded"></div>
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-5/6 rounded"></div>
            <div className="skeleton h-32 w-full rounded-lg"></div>
        </div>
    );
}

export function SkeletonText({ className = "" }: SkeletonProps) {
    return <div className={`skeleton h-4 rounded ${className}`}></div>;
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export default function SkeletonLoader() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
        >
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </motion.div>
    );
}
