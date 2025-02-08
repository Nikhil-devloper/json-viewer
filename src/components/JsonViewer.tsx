'use client';
import React, { useState } from 'react';
import JSONPretty from 'react-json-pretty';

interface JsonViewerProps {
  initialData?: {
    name: string;
    description: string;
    features: string[];
    config: {
      version: string;
      isDemo: boolean;
    };
  };
  className?: string;
  onDataChange?: (data: {
    name: string;
    description: string;
    features: string[];
    config: {
      version: string;
      isDemo: boolean;
    };
  }) => void;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ 
  initialData = { 
    hello: 'world',
    numbers: [1, 2, 3],
    nested: {
      a: 1,
      b: 2,
      c: [3, 4, 5]
    }
  },
  onDataChange
}) => {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(initialData, null, 2));
  const [jsonData, setJsonData] = useState(initialData);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setJsonData(parsed);
      onDataChange?.(parsed);
      setError('');
    } catch (error) {
      console.error('JSON parsing error:', error);
      setError('Invalid JSON format');
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="grid grid-cols-2 gap-4 p-4 h-[calc(100vh-60px)]">
        <div className="relative">
          <textarea
            value={jsonInput}
            onChange={handleInputChange}
            className="w-full h-full p-4 font-mono text-sm rounded-lg overflow-y-auto bg-gray-900 text-gray-100 resize-none"
            placeholder="Enter JSON here..."
          />
          {error && (
            <div className="absolute bottom-4 left-4 right-4 p-2 bg-red-500 text-white rounded">
              {error}
            </div>
          )}
        </div>

        <div className="overflow-y-auto rounded-lg bg-gray-900">
          <div className="p-4">
            <JSONPretty 
              data={jsonData} 
              theme={{
                main: 'line-height:1.3;color:#66d9ef;background:#272822;'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonViewer; 