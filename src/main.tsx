
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import App from './App.tsx';
import './index.css';

// Create a container for Radix portals
function RadixPortalRoot() {
  return <div id="radix-portal-root" />;
}

// Create a query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <App />
            <RadixPortalRoot />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Router>
);
