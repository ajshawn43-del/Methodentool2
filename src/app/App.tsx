import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { DebugPage } from './pages/DebugPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
    </HashRouter>
  );
}