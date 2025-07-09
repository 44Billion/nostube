import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NostrLoginProvider } from '@nostrify/react/login';
import NostrProvider from '@/components/NostrProvider';
import { AppProvider } from '@/components/AppProvider';
import { AppConfig } from '@/contexts/AppContext';

interface TestAppProps {
  children: React.ReactNode;
}

export function TestApp({ children }: TestAppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const defaultConfig: AppConfig = {
    theme: 'light',
    relays: [{ url: 'wss://relay.nostr.band', name: 'relay.nostr.band', tags: ['read', 'write'] }],
    videoType: 'videos',
  };

  return (
    <BrowserRouter>
      <AppProvider storageKey="test-app-config" defaultConfig={defaultConfig}>
        <QueryClientProvider client={queryClient}>
          <NostrLoginProvider storageKey="test-login">
            <NostrProvider relayUrl={defaultConfig.relays[0].url}>{children}</NostrProvider>
          </NostrLoginProvider>
        </QueryClientProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default TestApp;
