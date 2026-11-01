import React from 'react';
import { Clock, Check } from 'lucide-react';

export default function ServiceCard({ service, isSelected, onSelect }) {
    return (
        <div
            onClick={() => onSelect(service)}
            className={`cursor-pointer rounded-xl border p-5 transition-all duration-200 ${isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                }`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm opacity-80">
                        <Clock className="h-4 w-4" />
                        <span>{service.durationMinutes} minutes</span>
                    </div>
                </div>
                <span className="text-xl font-bold">${service.price}</span>
            </div>

            <p className="mt-3 text-sm opacity-75">{service.description}</p>

            {isSelected && (
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    <Check className="h-4 w-4" /> Selected Package
                </div>
            )}
        </div>
    );
}