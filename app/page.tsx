
'use client';

import { useState, useEffect } from 'react';
import InteractionCard from './components/InteractionCard';
import StatsOverview from './components/StatsOverview';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';

interface Interaction {
  id: number;
  title: string;
  user: { name: string; role: string };
  document: string;
  category: string;
  created_at: string;
  vote_count: number;
  view_count: number;
}

export default function Home() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);

  useEffect(() => {
    // Fetch data from our new API route
    async function fetchData() {
      try {
        const res = await fetch('/api/interactions');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setInteractions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter logic
  const filteredInteractions = interactions.filter(i => {
    const query = searchQuery.toLowerCase();
    return (
      i.title.toLowerCase().includes(query) ||
      i.document.toLowerCase().includes(query) ||
      i.user.name.toLowerCase().includes(query)
    );
  });

  // Calculate stats
  const totalThreads = interactions.length;
  const uniqueAuthors = new Set(interactions.map(i => i.user.name)).size;
  const totalViews = interactions.reduce((acc, curr) => acc + (curr.view_count || 0), 0);

  return (
    <main className="min-h-screen bg-slate-900 text-white selection:bg-violet-500 selection:text-white">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 h-full w-full bg-slate-900 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">
            Ed Discussion Insights
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore and analyze class participation trends.
          </p>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <StatsOverview
          totalThreads={totalThreads}
          uniqueAuthors={uniqueAuthors}
          totalViews={totalViews}
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-sm">{filteredInteractions.length} results found</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInteractions.map((interaction) => (
                <InteractionCard
                  key={interaction.id}
                  interaction={interaction}
                  onClick={setSelectedInteraction}
                />
              ))}
            </div>
            {filteredInteractions.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}

        {/* Details Modal */}
        <Modal
          isOpen={!!selectedInteraction}
          onClose={() => setSelectedInteraction(null)}
          title={selectedInteraction?.title}
        >
          {selectedInteraction && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm uppercase">
                  {selectedInteraction.user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-slate-900 font-semibold">{selectedInteraction.user.name}</p>
                  <p className="text-slate-500 text-sm">
                    {new Date(selectedInteraction.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  </p>
                </div>
                <div className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${selectedInteraction.category === 'Curiosity' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {selectedInteraction.category}
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {selectedInteraction.document.replace(/<[^>]*>/g, '')}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center text-sm text-slate-500">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-lg">{selectedInteraction.view_count}</span>
                  <span>Views</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-lg">{selectedInteraction.vote_count}</span>
                  <span>Votes</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-lg">#{selectedInteraction.id}</span>
                  <span>ID</span>
                </div>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </main>
  );
}
