import React, { useState } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
};
