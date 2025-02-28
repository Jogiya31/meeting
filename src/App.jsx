import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';

const App = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true, // Already added for `startTransition` flag
        v7_relativeSplatPath: true, // Opt-in for the relative splat path change in v7
      }}
    >
      {renderRoutes(routes)}
    </BrowserRouter>
  );
};

export default App;
