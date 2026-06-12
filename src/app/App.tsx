import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { DebugPage } from './pages/DebugPage';

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <HashRouter>
      <button
        onClick={() => setDark(!dark)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-gray-900 text-white p-3 shadow-lg dark:bg-white dark:text-gray-900"
      >
        {dark ? <Sun size={22} /> : <Moon size={22} />}
      </button>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
    </HashRouter>
  );
}
