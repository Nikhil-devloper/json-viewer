import React, { useState, useRef } from 'react';
import JSONPretty from 'react-json-pretty';

interface EnvConverterProps {
  inputText: string;
  onUpdate: (text: string, parsedJson: Record<string, string>) => void;
  data: Record<string, string>;
}

interface JsonData {
  [key: string]: string | number | boolean | null | JsonData | Array<any>;
}

const EnvConverter: React.FC<EnvConverterProps> = ({
  inputText,
  onUpdate,
  data
}) => {
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [jsonData, setJsonData] = useState<JsonData | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    try {
      const json: Record<string, string> = {};
      const lines = newText.split('\n');

      lines.forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
          const [key, ...valueParts] = line.split('=');
          const value = valueParts.join('=');
          if (key && value) {
            json[key.trim()] = value.trim().replace(/["']/g, '');
          }
        }
      });

      onUpdate(newText, json);
      setError('');
    } catch {
      setError('Invalid .env format');
      onUpdate(newText, data);
    }
  };

  const renderCodeView = () => {
    return (
      <JSONPretty 
        data={data} 
        theme={{
          main: 'line-height:1.3;color:#66d9ef;background:transparent;overflow:auto;',
          key: 'color:#f92672;',
          string: 'color:#fd971f;',
          value: 'color:#a6e22e;',
          boolean: 'color:#ac81fe;',
        }}
      />
    );
  };

  const renderTreeView = () => {
    return (
      <pre className="p-4 font-mono text-gray-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <div className="flex h-full">
      {/* Input Section */}
      <div className="flex-1 p-4 select-none">
        <textarea
          ref={inputRef}
          value={inputText}
          onChange={handleInputChange}
          className="w-full h-full bg-gray-800 text-gray-200 p-4 rounded-lg font-mono"
          placeholder="Paste your ENV content here..."
        />
      </div>

      {/* Output Section */}
      <div className="flex-1 p-4 select-none">
        <div className="relative">
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
            className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            Copy
          </button>
          <div 
            ref={outputRef}
            className="w-full h-full bg-gray-800 rounded-lg overflow-auto select-text"
          >
            <pre className="p-4 font-mono text-gray-200">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvConverter; 