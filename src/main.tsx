import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import App from './App.tsx';
import './index.css';

// Silently suppress THREE.Clock deprecation warning until @react-three/fiber migrates to THREE.Timer
if (typeof (THREE as any).setConsoleFunction === 'function') {
  (THREE as any).setConsoleFunction((type: string, message: string, ...rest: any[]) => {
    if (typeof message === 'string' && (message.includes('Clock') || message.includes('deprecated'))) {
      return;
    }
    if (type === 'warn') {
      console.warn(message, ...rest);
    } else if (type === 'error') {
      console.error(message, ...rest);
    } else {
      console.log(message, ...rest);
    }
  });
}

// Silently suppress benign Vite HMR websocket rejection when HMR is disabled in container
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : reason?.message || '';
    if (msg.includes('WebSocket') || msg.includes('websocket')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
