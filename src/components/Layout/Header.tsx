import React from 'react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">SlidePilot</h1>
        <span className="text-sm text-gray-500">AI-Powered PowerPoint Editor</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
