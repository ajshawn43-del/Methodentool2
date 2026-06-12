import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { DebugPage } from './pages/DebugPage';

export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <HashRouter>
      <button
        onClick={() => setDark((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 rounded-full border border-gray-300 bg-white p-4 text-gray-900 shadow-lg transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        title={dark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
      >
        {dark ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
    </HashRouter>
  );
}
