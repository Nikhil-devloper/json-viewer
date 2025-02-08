import React, { useState } from 'react';
import JsonViewer from './components/JsonViewer';
import EnvConverter from './components/EnvConverter';
import JsonToEnv from './components/JsonToEnv';
import NavBar from './components/NavBar';

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

  const [jsonText, setJsonText] = useState(JSON.stringify(sampleData, null, 2));
  const [jsonData, setJsonData] = useState(sampleData);
  const [envText, setEnvText] = useState('');
  const [envData, setEnvData] = useState({});
  const [jsonToEnvText, setJsonToEnvText] = useState('');
  const [envOutput, setEnvOutput] = useState('');

  const handleJsonUpdate = (text: string, data: { name: string; description: string; features: string[]; config: { version: string; isDemo: boolean; } }) => {
    setJsonText(text);
    setJsonData(data);
  };

  const handleEnvUpdate = (text: string, data: object) => {
    setEnvText(text);
    setEnvData(data);
  };

  const handleJsonToEnvUpdate = (text: string, output: string) => {
    setJsonToEnvText(text);
    setEnvOutput(output);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'json-viewer':
        return <JsonViewer 
          data={jsonData} 
          inputText={jsonText} 
          onUpdate={handleJsonUpdate}
        />;
      case 'feature-2':
        return <EnvConverter 
          data={envData} 
          inputText={envText} 
          onUpdate={handleEnvUpdate}
        />;
      case 'feature-3':
        return <JsonToEnv 
          data={envOutput} 
          inputText={jsonToEnvText} 
          onUpdate={handleJsonToEnvUpdate}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-gray-900 select-none">
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden select-text">
        {renderContent()}
      </div>
    </div>
  );
};

export default App; 