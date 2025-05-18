
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';

// Using the provided Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_d2FybS1ncm91cGVyLTgwLmNsZXJrLmFjY291bnRzLmRldiQ";

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-book-red hover:bg-red-700',
          footerActionLink: 'text-book-red hover:text-red-700'
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
