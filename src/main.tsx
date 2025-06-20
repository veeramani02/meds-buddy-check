import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ✨ ADD THESE IMPORTS:
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './SupabaseClient'; // ✅ adjust if path differs
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// ✨ INIT REACT QUERY CLIENT
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <SessionContextProvider supabaseClient={supabase}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </SessionContextProvider>
);
