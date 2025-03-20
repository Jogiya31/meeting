import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import routes, { renderRoutes } from './routes';
import { AuthProvider } from './contexts/AuthContext.jsx';
import DataProvider from './contexts/DataContext';

const App = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true, // Already added for `startTransition` flag
        v7_relativeSplatPath: true // Opt-in for the relative splat path change in v7
      }}
    >
      <AuthProvider>
        <DataProvider>{renderRoutes(routes)}</DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
