import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Markdown } from './markdown';
import { Button } from './ui/button';
import { Copy, Printer, Download } from 'lucide-react';
import { toast } from 'sonner';

interface TechnicalCourseProps {
  content: string;
  isEditable?: boolean;
  onSaveContent?: (content: string, debounce: boolean) => void;
  isCurrentVersion?: boolean;
  status?: 'streaming' | 'idle';
}

// Simple function to convert markdown to HTML without external dependencies
function formatMarkdownToHTML(markdown: string): string {
  if (!markdown) return '';
  
  // Basic markdown conversion
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\_\_(.*)\_\_/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\_(.*?)\_/gim, '<em>$1</em>')
    // Links
    .replace(/\[([^\[]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
    // Lists
    .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gm, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/gm, '<code>$1</code>')
    // Paragraphs
    .replace(/^(?!<[h|ul|ol|pre])(.*$)/gim, '<p>$1</p>');
  
  // Fix nested lists (this is a simple approach, not perfect)
  html = html
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/<\/ol>\s*<ol>/g, '');
  
  return html;
}

export function TechnicalCourse({
  content,
  isEditable = false,
  onSaveContent,
  isCurrentVersion = true,
  status = 'idle',
}: TechnicalCourseProps) {
  const [activeTab, setActiveTab] = useState('preview');
  // Parse the content to extract course metadata
  const courseTitle = extractCourseTitle(content);
  const courseType = content.includes('Full Course') ? 'Full Course' : 'Course Outline';
  
  // Function to handle printing the course
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${courseTitle || 'Technical Course'}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; }
              p { margin-bottom: 16px; }
              ul, ol { margin-bottom: 16px; padding-left: 24px; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              @media print {
                @page { margin: 2cm; }
              }
            </style>
          </head>
          <body>
            <div class="markdown-content">${formatMarkdownToHTML(content)}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  // Function to download the course as a markdown file
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${courseTitle || 'technical-course'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Course downloaded successfully!');
  };

  // Function to copy the course content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Course content copied to clipboard!');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{courseTitle || 'Technical Course'}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 ${activeTab === 'preview' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-4 py-2 ${activeTab === 'structure' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          >
            Course Structure
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-4 py-2 ${activeTab === 'metadata' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          >
            Metadata
          </button>
        </div>
        
        {activeTab === 'preview' && (
          <div className="min-h-[500px]">
          <Card className="border rounded-md p-4">
            <CardContent className="p-0 pt-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <Markdown content={content} />
              </div>
            </CardContent>
          </Card>
          </div>
        )}
        
        {activeTab === 'structure' && (
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Overview of the course modules and sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure content={content} />
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'metadata' && (
          <Card>
            <CardHeader>
              <CardTitle>Course Metadata</CardTitle>
              <CardDescription>
                Details about this technical course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Title:</div>
                <div>{courseTitle || 'Untitled Course'}</div>
                
                <div className="font-medium">Type:</div>
                <div>{courseType}</div>
                
                <div className="font-medium">Status:</div>
                <div className="capitalize">{status}</div>
                
                <div className="font-medium">Editable:</div>
                <div>{isEditable ? 'Yes' : 'No'}</div>
                
                <div className="font-medium">Current Version:</div>
                <div>{isCurrentVersion ? 'Yes' : 'No'}</div>
                
                <div className="font-medium">Content Length:</div>
                <div>{content.length} characters</div>
                
                <div className="font-medium">Estimated Word Count:</div>
                <div>{Math.round(content.split(/\s+/).length)} words</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Helper function to extract the course title from the content
function extractCourseTitle(content: string): string {
  // Try to find the title in the first few lines
  const lines = content.split('\n').slice(0, 10);
  
  // Look for a line that starts with # or is all uppercase
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('# ')) {
      return trimmedLine.substring(2).trim();
    }
    if (trimmedLine.startsWith('Title:')) {
      return trimmedLine.substring(6).trim();
    }
  }
  
  return '';
}

// Component to display the course structure
function CourseStructure({ content }: { content: string }) {
  // Extract headings to show the structure
  const lines = content.split('\n');
  const headings: { level: number; text: string }[] = [];
  
  lines.forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim()
      });
    }
  });
  
  if (headings.length === 0) {
    return <p className="text-gray-500">No structured headings found in the course content.</p>;
  }
  
  return (
    <div className="pl-4 border-l-2 border-gray-200">
      {headings.map((heading, index) => (
        <div 
          key={index} 
          className="py-1"
          style={{ 
            marginLeft: `${(heading.level - 1) * 16}px`,
            fontSize: `${18 - heading.level}px`,
            fontWeight: 7 - heading.level > 4 ? 'bold' : 'normal'
          }}
        >
          {heading.text}
        </div>
      ))}
    </div>
  );
}
