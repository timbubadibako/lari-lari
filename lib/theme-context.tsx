import * as React from 'react';
import { useColorScheme } from 'nativewind';

type ThemeContextType = {
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
  setColorScheme: (scheme: 'light' | 'dark') => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();

  return (
    <ThemeContext.Provider
      value={{
        colorScheme: colorScheme ?? 'light',
        toggleColorScheme,
        setColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
