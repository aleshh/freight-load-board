import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { DatasetProvider } from './DatasetProvider';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DatasetProvider>{children}</DatasetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
