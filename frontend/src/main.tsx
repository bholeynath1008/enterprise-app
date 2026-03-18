import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import { store } from './app/store';
import './i18n';
import './index.css';
import { initGTM } from './lib/gtm';

initGTM();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: 'bg-card border border-border text-foreground shadow-xl',
              description: 'text-muted-foreground',
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
