import { useState, useEffect } from 'react';
import FloatingHeartsBackground from './components/FloatingHeartsBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Pics from './pages/Pics';
import Us from './pages/Us';
import Wishes from './pages/Wishes';

// Birthday Target: October 26, 2026 at 00:00:00 (Midnight)
const BIRTHDAY_DATE_STR = '2026-10-26T00:00:00';

const isPastMidnight = () => {
  return new Date().getTime() >= new Date(BIRTHDAY_DATE_STR).getTime();
};

function App() {
  const [theme, setTheme] = useState('dark');
  // Before Oct 26 12:00 AM, default to 'wishes' (countdown). After 12:00 AM, default to 'home'.
  const [activePage, setActivePage] = useState(() => (isPastMidnight() ? 'home' : 'wishes'));

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} theme={theme} />;
      case 'pics':
        return <Pics theme={theme} />;
      case 'us':
        return <Us theme={theme} />;
      case 'wishes':
        // If accessed after midnight, directly render Home
        if (isPastMidnight()) {
          return <Home setActivePage={setActivePage} theme={theme} />;
        }
        return <Wishes theme={theme} setActivePage={setActivePage} />;
      default:
        return <Home setActivePage={setActivePage} theme={theme} />;
    }
  };

  return (
    <FloatingHeartsBackground theme={theme} onToggleTheme={toggleTheme}>
      <div className="min-h-screen flex flex-col">
        {/* Centered Navigation Bar - Hidden completely on the Wishes / Countdown landing page */}
        {activePage !== 'wishes' && (
          <Navbar
            activePage={activePage}
            setActivePage={setActivePage}
            theme={theme}
          />
        )}

        {/* Active Page View */}
        <main className="flex-1 flex flex-col">
          {renderPage()}
        </main>
      </div>
    </FloatingHeartsBackground>
  );
}

export default App;
