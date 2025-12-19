
import React from 'react';

interface User {
    name: string;
    role: string;
}

interface Interaction {
    id: number;
    title: string;
    user: User;
    document: string;
    category: string;
    created_at: string;
    vote_count: number;
    view_count: number;
}

interface InteractionCardProps {
    interaction: Interaction;
    onClick: (interaction: Interaction) => void;
}

export default function InteractionCard({ interaction, onClick }: InteractionCardProps) {
    // Format info nicely
    const date = new Date(interaction.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Truncate document snippet
    const snippet = interaction.document.length > 200
        ? interaction.document.substring(0, 200) + '...'
        : interaction.document;

    return (
        <div
            onClick={() => onClick(interaction)}
            className="group relative overflow-hidden rounded-xl bg-white/5 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 border border-white/10 cursor-pointer"
        >
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${interaction.category === 'Curiosity' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                    {interaction.category || 'Discussion'}
                </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 pr-8">{interaction.title}</h3>

            <div className="flex items-center space-x-2 mb-4 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                    {interaction.user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-medium">{interaction.user.name}</span>
                    <span className="text-xs">{date}</span>
                </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed font-light">
                {snippet}
            </p>

            <div className="flex items-center space-x-4 text-xs text-gray-500 font-mono mt-auto border-t border-white/5 pt-4">
                <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <span>{interaction.view_count}</span>
                </span>
                <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    <span>{interaction.vote_count}</span>
                </span>
            </div>
        </div>
    );
}
