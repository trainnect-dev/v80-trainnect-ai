import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { ExternalLink } from 'lucide-react';

interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
  published_date?: string;
}

interface SearchResponse {
  results: SearchResult[];
  query: string;
  search_depth: string;
  max_results: number;
  include_raw_content: boolean;
  include_images: boolean;
}

interface SearchComponentProps {
  onSearch: (query: string) => Promise<SearchResponse>;
  initialResults?: SearchResponse;
  isLoading?: boolean;
  onResultSelect?: (result: SearchResult) => void;
}

export function SearchComponent({
  onSearch,
  initialResults,
  isLoading = false,
  onResultSelect,
}: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(initialResults || null);
  const [searching, setSearching] = useState(isLoading);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('results');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const searchResults = await onSearch(query);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search for factual information..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          disabled={searching}
        />
        <Button onClick={handleSearch} disabled={searching || !query.trim()}>
          {searching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2 border border-red-300 rounded bg-red-50">
          {error}
        </div>
      )}

      {searching && (
        <div className="space-y-3">
          <Skeleton className="h-[125px] w-full rounded-lg" />
          <Skeleton className="h-[125px] w-full rounded-lg" />
          <Skeleton className="h-[125px] w-full rounded-lg" />
        </div>
      )}

      {results && results.results.length > 0 && (
        <div className="w-full">
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 ${activeTab === 'results' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            >
              Results ({results.results.length})
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-4 py-2 ${activeTab === 'metadata' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            >
              Search Metadata
            </button>
          </div>
          {activeTab === 'results' && (
            <div className="space-y-3">
            {results.results.map((result, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base font-medium line-clamp-1">
                    {result.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1 truncate"
                    >
                      {result.url.replace(/^https?:\/\//, '')}
                      <ExternalLink size={12} />
                    </a>
                    {result.published_date && (
                      <span className="ml-2 text-gray-500">
                        • {new Date(result.published_date).toLocaleDateString()}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm line-clamp-3">{result.content}</p>
                </CardContent>
                <CardFooter className="p-2 pt-0 flex justify-between">
                  <div className="text-xs text-gray-500">
                    Score: {Math.round(result.score * 100)}%
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResultSelect && onResultSelect(result)}
                    className="text-xs"
                  >
                    Use This Result
                  </Button>
                </CardFooter>
              </Card>
            ))}
            </div>
          )}
          {activeTab === 'metadata' && (
            <Card>
              <CardHeader>
                <CardTitle>Search Information</CardTitle>
                <CardDescription>Details about your search query</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Query:</div>
                  <div>{results.query}</div>
                  
                  <div className="font-medium">Search Depth:</div>
                  <div className="capitalize">{results.search_depth}</div>
                  
                  <div className="font-medium">Results Count:</div>
                  <div>{results.results.length}</div>
                  
                  <div className="font-medium">Max Results:</div>
                  <div>{results.max_results}</div>
                  
                  <div className="font-medium">Raw Content:</div>
                  <div>{results.include_raw_content ? 'Included' : 'Not included'}</div>
                  
                  <div className="font-medium">Images:</div>
                  <div>{results.include_images ? 'Included' : 'Not included'}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {results && results.results.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No results found for "{results.query}"</p>
          <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
        </div>
      )}
    </div>
  );
}