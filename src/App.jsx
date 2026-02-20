import { useState, useEffect } from 'react';
import Login from './pages/Login';
import GalleryPage from './pages/GalleryPage';
import WishlistPage from './pages/WishlistPage';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('gallery');

  useEffect(() => {
    // Check authentication status on mount with smooth transition
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setCurrentPage('gallery');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#0d1117 radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1), transparent 50%)' }}>
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        userEmail={localStorage.getItem('userEmail')}
        onLogout={handleLogout}
      />
      
      <main className="github-scrollbar">
        {currentPage === 'gallery' ? (
          <GalleryPage />
        ) : (
          <WishlistPage />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-github bg-github-secondary mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-github-muted text-sm">
              © 2024 Gallery. Built with React, GSAP, and modern design.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-xs text-github-muted">GitHub-inspired design</span>
              <span className="text-github-muted">•</span>
              <span className="text-xs text-github-muted">Premium animations</span>
              <span className="text-github-muted">•</span>
              <span className="text-xs text-github-muted">Modern UI/UX</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
