// Create a new file named ReactLayoutProvider.jsx
import React, { createContext, useContext } from 'react';

// Create a context to ensure React is properly loaded
const ReactLayoutContext = createContext(null);

// A provider component that ensures React is available
export const ReactLayoutProvider = ({ children }) => {
  return (
    <ReactLayoutContext.Provider value={{ reactLoaded: true }}>
      {children}
    </ReactLayoutContext.Provider>
  );
};

// Hook to use the context
export const useReactLayout = () => {
  const context = useContext(ReactLayoutContext);
  if (!context) {
    throw new Error('useReactLayout must be used within ReactLayoutProvider');
  }
  return context;
};

// Export React for direct access
export { React };