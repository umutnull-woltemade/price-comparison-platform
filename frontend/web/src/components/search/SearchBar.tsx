'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { debounce } from '@/lib/utils';

interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand';
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = debounce(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.search.autocomplete(q);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setShowSuggestions(false);
    setQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text);
  };

  const popularSearches = [
    'iPhone 15',
    'Samsung Galaxy',
    'PlayStation 5',
    'MacBook Air',
    'AirPods Pro',
  ];

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Ürün, kategori veya marka arayın..."
          className="w-full px-6 py-4 pl-14 pr-14 text-lg rounded-full border-2 border-gray-300 focus:border-primary-500 focus:outline-none shadow-lg"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query || suggestions.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Aranıyor...</div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-6 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{suggestion.text}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {suggestion.type === 'product' && 'Ürün'}
                      {suggestion.type === 'category' && 'Kategori'}
                      {suggestion.type === 'brand' && 'Marka'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">Sonuç bulunamadı</div>
          ) : (
            <div className="py-2">
              <div className="px-6 py-2 text-sm font-semibold text-gray-500 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Popüler Aramalar</span>
              </div>
              <ul>
                {popularSearches.map((search, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleSearch(search)}
                      className="w-full px-6 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    >
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{search}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
