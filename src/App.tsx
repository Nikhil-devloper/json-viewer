import React, { useState } from 'react';
import JsonViewer from './components/JsonViewer';

type Tab = 'json-viewer' | 'feature-2' | 'feature-3';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('json-viewer');

  const sampleData = {
    name: "JSON Viewer Demo",
    description: "A simple JSON viewer component",
    features: [
      "Dark/Light mode",
      "Collapsible nodes",
      "Copy to clipboard",
      "Dynamic updates"
    ],
    config: {
      version: "1.0.0",
      isDemo: true
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'json-viewer':
        return <JsonViewer initialData={sampleData} />;
      case 'feature-2':
        return <div className="text-white">Feature 2 Coming Soon</div>;
      case 'feature-3':
        return <div className="text-white">Feature 3 Coming Soon</div>;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <div className="border-b border-gray-700">
        <nav className="flex space-x-4 px-6">
          <button
            onClick={() => setActiveTab('json-viewer')}
            className={`py-4 px-6 focus:outline-none ${
              activeTab === 'json-viewer'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            JSON Viewer
          </button>
          <button
            onClick={() => setActiveTab('feature-2')}
            className={`py-4 px-6 focus:outline-none ${
              activeTab === 'feature-2'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Feature 2
          </button>
          <button
            onClick={() => setActiveTab('feature-3')}
            className={`py-4 px-6 focus:outline-none ${
              activeTab === 'feature-3'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Feature 3
          </button>
        </nav>
      </div>
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default App; 