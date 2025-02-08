import React, { useState, useRef } from 'react';
import JSONPretty from 'react-json-pretty';
import styles from './JsonViewer.module.css';

interface EnvConverterProps {
  inputText: string;
  onUpdate: (text: string, parsedJson: any) => void;
  data: any;
}

const EnvConverter: React.FC<EnvConverterProps> = ({
  inputText,
  onUpdate,
  data
}) => {
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

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
    } catch (err) {
      setError('Invalid .env format');
      onUpdate(newText, data);
    }
  };

  const scrollToTop = () => {
    if (inputRef.current) {
      inputRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    if (outputRef.current) {
      outputRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    const inputContainer = inputRef.current?.parentElement;
    const outputContainer = outputRef.current?.parentElement?.parentElement;

    if (inputContainer) {
      inputContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    if (outputContainer) {
      outputContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full h-[80vh]">
      <div className="grid grid-cols-2 gap-4 p-4 h-full">
        <div className="relative h-full overflow-scroll">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            className="w-full h-full p-4 font-mono text-sm rounded-lg bg-gray-900 text-gray-100 resize-none overflow-y-auto border border-gray-700 focus:border-blue-500 outline-none"
            placeholder="Paste your .env file content here..."
          />
          {error && (
            <div className="absolute bottom-4 left-4 right-4 p-2 bg-red-500 text-white rounded">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col relative h-full overflow-scroll">
          <div className="flex-1 rounded-lg bg-gray-900 border border-gray-700">
            <div 
              ref={outputRef}
              className="p-4 overflow-scroll"
            >
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
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className={styles.scrollTopButton}
        aria-label="Scroll to top"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </button>
    </div>
  );
};

export default EnvConverter; 