import { Artifact } from '@/components/create-artifact';
import { DiffView } from '@/components/diffview';
import { DocumentSkeleton } from '@/components/document-skeleton';
import { TechnicalCourse } from '@/components/technical-course';
import {
  ClockRewind,
  CopyIcon,
  MessageIcon,
  PenIcon,
  RedoIcon,
  UndoIcon,
} from '@/components/icons';
import { Search, BookOpen, List } from 'lucide-react';
import { Suggestion } from '@/lib/db/schema';
import { toast } from 'sonner';
import { useState } from 'react';
import { SearchComponent } from '@/components/search';
import { Button } from '@/components/ui/button';

// Define custom stream part types
type CustomStreamPartType = 'search-results' | 'course-type';

// Define search results interface
interface SearchResponse {
  results: any[];
  query: string;
  search_depth: string;
  max_results: number;
  include_raw_content: boolean;
  include_images: boolean;
}

interface TechnicalCourseArtifactMetadata {
  suggestions: Array<Suggestion>;
  searchResults: SearchResponse | null;
  isSearchVisible: boolean;
  courseType: 'outline' | 'full';
}

export const technicalCourseArtifact = new Artifact<'technical-course', TechnicalCourseArtifactMetadata>({
  kind: 'technical-course',
  description: 'Create comprehensive technical courses with factual, citable content.',
  initialize: async ({ documentId, setMetadata }) => {
    setMetadata({
      suggestions: [],
      searchResults: null,
      isSearchVisible: false,
      courseType: 'outline', // Default to outline
    });
  },
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === 'suggestion') {
      setMetadata((metadata) => {
        return {
          ...metadata,
          suggestions: [
            ...metadata.suggestions,
            streamPart.content as Suggestion,
          ],
        };
      });
    }

    if ((streamPart.type as string) === 'search-results') {
      setMetadata((metadata) => {
        // First convert to unknown, then to SearchResponse to avoid type errors
        const searchResults = streamPart.content as unknown;
        // Check if the content has the expected structure
        const validSearchResults = typeof searchResults === 'object' && searchResults !== null && 'results' in searchResults
          ? searchResults as SearchResponse
          : {
              results: [],
              query: '',
              search_depth: 'basic',
              max_results: 5,
              include_raw_content: false,
              include_images: false
            };
            
        return {
          ...metadata,
          searchResults: validSearchResults,
        };
      });
    }

    if ((streamPart.type as string) === 'course-type') {
      setMetadata((metadata) => {
        return {
          ...metadata,
          courseType: streamPart.content as 'outline' | 'full',
        };
      });
    }

    if (streamPart.type === 'text-delta') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          content: draftArtifact.content + (streamPart.content as string),
          isVisible:
            draftArtifact.status === 'streaming' &&
            draftArtifact.content.length > 400 &&
            draftArtifact.content.length < 450
              ? true
              : draftArtifact.isVisible,
          status: 'streaming',
        };
      });
    }
  },
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
    setMetadata,
  }) => {
    const [searchQuery, setSearchQuery] = useState('');

    if (isLoading) {
      return <DocumentSkeleton artifactKind="technical-course" />;
    }

    if (mode === 'diff') {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);

      return <DiffView oldContent={oldContent} newContent={newContent} />;
    }

    const handleSearch = async (query: string): Promise<SearchResponse> => {
      // This is a mock function - the actual search will be handled by the AI
      // through the Tavily search tool in the server-side implementation
      setSearchQuery(query);
      return {
        results: [],
        query,
        search_depth: 'basic',
        max_results: 5,
        include_raw_content: false,
        include_images: false
      };
    };

    const toggleSearch = () => {
      setMetadata((currentMetadata) => ({
        ...currentMetadata,
        isSearchVisible: !currentMetadata.isSearchVisible
      }));
    };

    return (
      <div className="flex flex-col w-full">
        {metadata?.isSearchVisible && (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Research Tool</h3>
              <Button variant="ghost" size="sm" onClick={toggleSearch}>
                Close
              </Button>
            </div>
            <SearchComponent 
              onSearch={handleSearch}
              initialResults={metadata?.searchResults || undefined}
            />
          </div>
        )}
        
        <div className="flex flex-row py-8 md:p-20 px-4">
          <TechnicalCourse
            content={content}
            isEditable={isCurrentVersion}
            onSaveContent={onSaveContent}
            isCurrentVersion={isCurrentVersion}
            status={status}
          />
        </div>
      </div>
    );
  },
  actions: [
    {
      icon: <ClockRewind size={18} />,
      description: 'View changes',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('toggle');
      },
      isDisabled: ({ currentVersionIndex, setMetadata }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <UndoIcon size={18} />,
      description: 'View Previous version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('prev');
      },
      isDisabled: ({ currentVersionIndex }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: 'View Next version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('next');
      },
      isDisabled: ({ isCurrentVersion }) => {
        if (isCurrentVersion) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy to clipboard',
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard!');
      },
    },
    {
      icon: <Search size={18} />,
      description: 'Toggle research tool',
      onClick: ({ metadata, setMetadata }) => {
        setMetadata({
          ...metadata,
          isSearchVisible: !metadata.isSearchVisible
        });
      },
    },
  ],
  toolbar: [
    {
      icon: <BookOpen size={18} />,
      description: 'Create full course',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Create a New Full Technical Course',
        });
      },
    },
    {
      icon: <List size={18} />,
      description: 'Create course outline',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Create a New Technical Course Outline',
        });
      },
    },
    {
      icon: <PenIcon />,
      description: 'Improve course content',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Please improve the course content with more detailed explanations and examples.',
        });
      },
    },
    {
      icon: <MessageIcon />,
      description: 'Request suggestions',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Please suggest improvements for this technical course.',
        });
      },
    },
  ],
});
