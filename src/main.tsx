
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';

// Replace with your actual Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "REPLACE_WITH_YOUR_CLERK_PUBLISHABLE_KEY";

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
