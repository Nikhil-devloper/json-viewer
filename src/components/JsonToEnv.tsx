import React, { useState, useRef } from 'react';
import styles from './JsonViewer.module.css';

interface JsonToEnvProps {
  inputText: string;
  onUpdate: (text: string, parsedEnv: string) => void;
  data: string;
}

const JsonToEnv: React.FC<JsonToEnvProps> = ({
  inputText,
  onUpdate,
  data
}) => {
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    try {
      const json = JSON.parse(newText);
      const envLines: string[] = [];

      const processObject = (obj: any, prefix: string = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const envKey = prefix ? `${prefix}_${key}` : key;
          
          if (typeof value === 'object' && value !== null) {
            processObject(value, envKey);
          } else {
            envLines.push(`${envKey}=${String(value)}`);
          }
        });
      };

      processObject(json);
      const envOutput = envLines.join('\n');
      onUpdate(newText, envOutput);
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
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
            placeholder="Paste your JSON here..."
          />
          {error && (
            <div className="absolute bottom-4 left-4 right-4 p-2 bg-red-500 text-white rounded">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col relative h-full overflow-scroll">
          <div className="flex-1 rounded-lg bg-gray-900 border border-gray-700">
            <textarea
              ref={outputRef}
              value={data}
              readOnly
              className="w-full h-full p-4 font-mono text-sm bg-transparent text-gray-100 resize-none outline-none"
              placeholder=".env output will appear here..."
            />
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

export default JsonToEnv; 