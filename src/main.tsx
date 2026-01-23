import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Get Clerk publishable key from environment
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
    const errorHtml = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Configuration Error</h1>
        <p style="color: #374151;">The <code>VITE_CLERK_PUBLISHABLE_KEY</code> environment variable is missing.</p>
        <p style="color: #6b7280; font-size: 0.9rem;">Please add this key to your Vercel Project Settings > Environment Variables and redeploy.</p>
      </div>
    `;
    document.body.innerHTML = errorHtml;
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}

// Global error handler to catch initialization crashes
window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global Error:', error);
    const errorHtml = `
      <div style="padding: 20px; font-family: monospace; color: #dc2626; background: #fee2e2; margin: 20px; border-radius: 8px;">
        <h3 style="margin-top: 0;">Application Error</h3>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Source:</strong> ${source}:${lineno}:${colno}</p>
        ${error && error.stack ? `<pre style="white-space: pre-wrap; margin-top: 10px; font-size: 0.8em; color: #991b1b;">${error.stack}</pre>` : ''}
      </div>
    `;
    // Append to body so previous content is preserved if possible
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = errorHtml;
    document.body.appendChild(errorDiv);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={clerkPubKey}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ClerkProvider>
    </React.StrictMode>,
);
