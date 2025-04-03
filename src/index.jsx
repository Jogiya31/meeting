import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from './contexts/ConfigContext';
import './index.scss';
import 'react-datepicker/dist/react-datepicker.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './app/store';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // Provide Redux store to the entire application

  <ConfigProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);
