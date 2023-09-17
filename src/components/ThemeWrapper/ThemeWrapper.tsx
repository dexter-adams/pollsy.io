import React from 'react';
import { useTheme } from '../../providers/ThemeProvider';

interface ThemeWrapperProps {
    children: React.ReactNode; // Explicitly type the children prop
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={`app-theme-${theme}`}>
            <button onClick={toggleTheme}>Toggle Theme</button>
            {children}
        </div>
    );
};

export default ThemeWrapper;
