'use client';
import React, { useState, useRef } from 'react';
import JSONPretty from 'react-json-pretty';
import styles from './JsonViewer.module.css';
import { JsonData } from '../types/json';

type ViewMode = 'code' | 'tree';

interface JsonViewerProps {
  data: JsonData;
  inputText: string;
  onUpdate: (text: string, parsedData: JsonData) => void;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ 
  data,
  inputText,
  onUpdate
}) => {
  const [error, setError] = useState('');
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('code');
  const outputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [jsonData, setJsonData] = useState<JsonData | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;

    try {
      const parsed = JSON.parse(newText);
      onUpdate(newText, parsed);
      setError('');
      
      // Restore cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart;
          textareaRef.current.selectionEnd = selectionEnd;
        }
      }, 0);
    } catch (err) {
      setError('Invalid JSON format');
      onUpdate(newText, data);
      
      // Restore cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart;
          textareaRef.current.selectionEnd = selectionEnd;
        }
      }, 0);
    }
  };

  const toggleCollapse = (path: string) => {
    const newCollapsedPaths = new Set(collapsedPaths);
    if (collapsedPaths.has(path)) {
      newCollapsedPaths.delete(path);
    } else {
      newCollapsedPaths.add(path);
    }
    setCollapsedPaths(newCollapsedPaths);
  };

  const scrollToTop = () => {
    // Scroll output container
    if (outputRef.current) {
      outputRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Scroll input container
    if (textareaRef.current) {
      textareaRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Also scroll the parent containers
    const inputContainer = textareaRef.current?.parentElement;
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

  const renderValue = (
    value: string | number | boolean | null | JsonData | Array<string | number | boolean | null | JsonData>,
    path: string = '', 
    index?: number, 
    arrayLength?: number
  ): React.ReactNode => {
    if (Array.isArray(value)) {
      const isCollapsed = collapsedPaths.has(path);
      return (
        <div className={styles.arrayContainer}>
          <div className={styles.containerHeader}>
            <span 
              className={styles.arrow}
              onClick={() => toggleCollapse(path)}
            >
              {isCollapsed ? '▶' : '▼'}
            </span>
            <span>[</span>
            {isCollapsed && <span>...</span>}
            {isCollapsed && (
              <>
                <span>]</span>
                {index !== undefined && index < arrayLength! - 1 && <span className={styles.comma}>,</span>}
              </>
            )}
          </div>
          {!isCollapsed && (
            <>
              <div className={styles.indent}>
                {value.map((item, idx) => (
                  <div key={idx}>
                    {renderValue(item, `${path}.${idx}`, idx, value.length)}
                  </div>
                ))}
              </div>
              <div className={styles.containerFooter}>
                <span>]</span>
                {index !== undefined && index < arrayLength! - 1 && <span className={styles.comma}>,</span>}
              </div>
            </>
          )}
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      const isCollapsed = collapsedPaths.has(path);
      return (
        <div className={styles.objectContainer}>
          <div className={styles.containerHeader}>
            <span 
              className={styles.arrow}
              onClick={() => toggleCollapse(path)}
            >
              {isCollapsed ? '▶' : '▼'}
            </span>
            <span>{'{'}</span>
            {isCollapsed && <span>...</span>}
            {isCollapsed && (
              <>
                <span>{'}'}</span>
                {index !== undefined && index < arrayLength! - 1 && <span className={styles.comma}>,</span>}
              </>
            )}
          </div>
          {!isCollapsed && (
            <>
              <div className={styles.indent}>
                {Object.entries(value).map(([key, val], idx, arr) => (
                  <div key={key} className={styles.property}>
                    <span className={styles.key}>{key}</span>
                    <span>: </span>
                    {renderValue(val, `${path}.${key}`, idx, arr.length)}
                  </div>
                ))}
              </div>
              <div className={styles.containerFooter}>
                <span>{'}'}</span>
                {index !== undefined && index < arrayLength! - 1 && <span className={styles.comma}>,</span>}
              </div>
            </>
          )}
        </div>
      );
    }

    if (typeof value === 'string') {
      return <span className={styles.string}>"{value}"</span>;
    }

    if (typeof value === 'number') {
      return <span className={styles.number}>{value}</span>;
    }

    if (typeof value === 'boolean') {
      return <span className={styles.boolean}>{value.toString()}</span>;
    }

    if (value === null) {
      return <span className={styles.null}>null</span>;
    }

    const rendered = (
      <span className={styles[typeof value]}>
        {typeof value === 'string' ? `"${value}"` : String(value)}
      </span>
    );

    return (
      <>
        {rendered}
        {index !== undefined && index < arrayLength! - 1 && <span className={styles.comma}>,</span>}
      </>
    );
  };

  const renderTreeView = () => {
    return (
      <div className={styles.jsonViewer}>
        {renderValue(data)}
      </div>
    );
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

  const handleJsonInput = (input: string) => {
    try {
      const parsed = JSON.parse(input);
      setJsonData(parsed);
      setError('');
    } catch {
      setError('Invalid JSON input');
    }
  };

  return (
    <div className="w-full h-[80vh]">
      <div className="grid grid-cols-2 gap-4 p-4 h-full">
        <div className="relative h-full overflow-scroll select-none">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleInputChange}
            className="w-full h-full p-4 font-mono text-sm rounded-lg bg-gray-900 text-gray-100 resize-none overflow-y-auto border border-gray-700 focus:border-blue-500 outline-none"
            placeholder="Enter JSON here..."
          />
          {error && (
            <div className="absolute bottom-4 left-4 right-4 p-2 bg-red-500 text-white rounded">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col relative h-full overflow-scroll select-none">
          <div className="fixed top-20 right-8 mb-2 flex justify-end space-x-2">
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded ${
                viewMode === 'code' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Code View
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 rounded ${
                viewMode === 'tree' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Tree View
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
              className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              Copy
            </button>
          </div>
          <div className="flex-1 rounded-lg bg-gray-900 border border-gray-700">
            <div 
              ref={outputRef}
              className="p-4 overflow-scroll select-text"
              tabIndex={0}
            >
              {viewMode === 'tree' ? renderTreeView() : renderCodeView()}
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

export default JsonViewer; 