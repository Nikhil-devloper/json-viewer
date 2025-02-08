import React from 'react';

type Tab = 'json-viewer' | 'feature-2' | 'feature-3';

interface NavBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-700 bg-gray-800 select-none">
      <div className="mx-auto px-4">
        <div className="flex items-center">
          <span
            onClick={() => onTabChange('json-viewer')}
            className={`
              px-6 py-4 text-sm font-medium mr-8 cursor-pointer
              transition-colors duration-200
              ${activeTab === 'json-viewer'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
              }
            `}
          >
            JSON Viewer
          </span>

          <span
            onClick={() => onTabChange('feature-2')}
            className={`
              px-6 py-4 text-sm font-medium mr-8 cursor-pointer
              transition-colors duration-200
              ${activeTab === 'feature-2'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
              }
            `}
          >
            ENV to JSON
          </span>

          <span
            onClick={() => onTabChange('feature-3')}
            className={`
              px-6 py-4 text-sm font-medium cursor-pointer
              transition-colors duration-200
              ${activeTab === 'feature-3'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
              }
            `}
          >
            JSON to ENV
          </span>
        </div>
      </div>
    </div>
  );
};

export default NavBar; 