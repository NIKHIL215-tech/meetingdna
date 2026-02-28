'use client';

import React from 'react';

interface TeamHealthHeatmapProps {
    data: number[];
}

export default function TeamHealthHeatmap({ data }: TeamHealthHeatmapProps) {
    return (
        <div className="flex gap-1 h-8 w-full">
            {data.map((intensity, i) => (
                <div
                    key={i}
                    className="flex-1 rounded-sm transition-all hover:scale-110 cursor-pointer relative group"
                    style={{
                        backgroundColor: intensity > 0.7
                            ? 'rgba(45, 212, 191, 0.8)' // Peak Focus
                            : intensity > 0.4
                                ? 'rgba(45, 212, 191, 0.4)' // Moderate
                                : intensity > 0
                                    ? 'rgba(45, 212, 191, 0.1)' // Low
                                    : 'rgba(255, 255, 255, 0.03)', // Idle
                    }}
                >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-[8px] font-bold text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                        {Math.round(intensity * 100)}% Intensity
                    </div>
                </div>
            ))}
        </div>
    );
}
