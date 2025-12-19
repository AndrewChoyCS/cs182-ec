
import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="relative w-full max-w-xl mx-auto mb-12">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-2xl leading-5 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm transition-all shadow-lg backdrop-blur-md"
                placeholder="Search threads by title, content, or author..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
