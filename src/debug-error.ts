// This file must be imported FIRST in main.tsx
// It sets up global error handling before any other application code runs
// This ensures we catch initialization errors (like missing env vars in imported modules)

if (typeof window !== 'undefined') {
    window.onerror = (message, source, lineno, colno, error) => {
        console.error('Global Error caught by debug-error.ts:', message);

        // Prevent recursive errors
        if (document.getElementById('global-error-overlay')) return;

        const errorHtml = `
      <div id="global-error-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #fefce8;
        color: #713f12;
        font-family: monospace;
        padding: 2rem;
        box-sizing: border-box;
        z-index: 99999;
        overflow: auto;
      ">
        <h1 style="color: #ef4444; margin-top: 0;">Application Startup Error</h1>
        <p style="font-size: 1.1em; font-weight: bold;">
          The application crashed before it could start.
        </p>
        
        <div style="background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <p style="margin-top: 0; color: #dc2626; font-weight: bold;">Error: ${message}</p>
          <p><strong>Source:</strong> ${source}:${lineno}:${colno}</p>
          ${error && error.stack ? `<pre style="background: #f3f4f6; padding: 1rem; border-radius: 4px; overflow-x: auto; margin-top: 1rem;">${error.stack}</pre>` : ''}
        </div>

        <div style="margin-top: 2rem; padding: 1rem; border: 1px solid #ca8a04; border-radius: 6px;">
          <h3 style="margin-top: 0;">Troubleshooting</h3>
          <ul style="padding-left: 1.5rem;">
            <li>Check <strong>Vercel Environment Variables</strong>.</li>
            <li>Ensure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> are set.</li>
            <li>Ensure <code>VITE_CLERK_PUBLISHABLE_KEY</code> is set.</li>
            <li>If you just updated variables, <strong>Redeploy</strong> to apply changes.</li>
          </ul>
        </div>
      </div>
    `;

        // Overwrite body to ensure visibility
        document.body.innerHTML = errorHtml;
    };
}
