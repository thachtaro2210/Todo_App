import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Header />
        <Routes>
          <Route index element={<HomePage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
