import React from 'react';
import QueryProvider from './QueryProvider';
import ThemeProvider from './ThemeProvider';
import AuthProvider from './AuthProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default AppProviders;

